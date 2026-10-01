import { getConfig, type KikoBooksConfig } from "../config.js";
import { TokenStore, type StoredTokens } from "./token-store.js";

/** Normalized API error thrown by the client on non-2xx responses. */
export class KikoBooksApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly body: unknown
    ) {
        super(message);
        this.name = "KikoBooksApiError";
    }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const USER_AGENT = "kikobooks-mcp-server/0.2.0";
/** Refresh slightly before true expiry to avoid 401 races. */
const EXPIRY_SKEW_MS = 30_000;

/**
 * Authenticated REST client for the KikoBooks API.
 *
 * Auth precedence: valid cached access token → refresh token → org API key.
 * A failed refresh automatically falls back to re-authenticating with the API
 * key. Rotated tokens are persisted via {@link TokenStore}; the API key is not.
 */
export class KikoBooksClient {
    private readonly cfg: KikoBooksConfig;
    private readonly store: TokenStore;

    private accessToken?: string;
    private refreshToken?: string;
    private expiresAt?: Date;
    private authInFlight?: Promise<void>;

    constructor(cfg: KikoBooksConfig = getConfig()) {
        this.cfg = cfg;
        this.store = new TokenStore(cfg.tokenStorePath);

        const persisted = this.store.load();
        this.accessToken = cfg.accessToken ?? persisted.accessToken;
        this.refreshToken = cfg.refreshToken ?? persisted.refreshToken;
        this.expiresAt = persisted.expiresAt ? new Date(persisted.expiresAt) : undefined;
    }

    /** True when any credential is configured (not whether it is currently valid). */
    hasCredentials(): boolean {
        return Boolean(this.cfg.apiKey || this.accessToken || this.refreshToken);
    }

    /** Resolves to true if a valid access token can be obtained right now. */
    async checkConnection(): Promise<boolean> {
        if (!this.hasCredentials()) return false;
        try {
            await this.authenticate();
            return Boolean(this.accessToken);
        } catch {
            return false;
        }
    }

    /** Clears cached tokens and wipes the token store (connect/disconnect flows). */
    disconnect(): void {
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.expiresAt = undefined;
        this.store.save({});
    }

    // ── Auth ────────────────────────────────────────────────────────────────

    private tokenIsValid(): boolean {
        return Boolean(
            this.accessToken &&
                this.expiresAt &&
                this.expiresAt.getTime() - EXPIRY_SKEW_MS > Date.now()
        );
    }

    private async authenticate(): Promise<void> {
        if (this.tokenIsValid()) return;
        if (this.authInFlight) return this.authInFlight;

        this.authInFlight = this.doAuthenticate().finally(() => {
            this.authInFlight = undefined;
        });
        return this.authInFlight;
    }

    private async doAuthenticate(): Promise<void> {
        if (this.refreshToken) {
            try {
                await this.refreshAccessToken();
                return;
            } catch {
                // Fall through to API-key re-auth below.
                this.refreshToken = undefined;
            }
        }

        if (this.cfg.apiKey) {
            await this.authenticateWithApiKey();
            return;
        }

        if (this.accessToken && this.expiresAt && this.expiresAt > new Date()) {
            return; // Caller supplied a still-valid access token directly.
        }

        throw new Error(
            "No usable KikoBooks credentials. Set KIKOBOOKS_API_KEY (or a valid " +
                "KIKOBOOKS_ACCESS_TOKEN/KIKOBOOKS_REFRESH_TOKEN) in the environment."
        );
    }

    private async authenticateWithApiKey(): Promise<void> {
        const res = await fetch(`${this.cfg.baseUrl}/api/Auth/api-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
            body: JSON.stringify({ apiKey: this.cfg.apiKey }),
        });

        if (!res.ok) {
            throw new Error(`API-key authentication failed (${res.status}).`);
        }

        const data = (await res.json()) as ValueDataResponse;
        if (data.isSuccess === false) {
            throw new Error("API-key authentication rejected by server.");
        }
        this.setTokens(data.response ?? data);
    }

    private async refreshAccessToken(): Promise<void> {
        const res = await fetch(`${this.cfg.baseUrl}/api/Token/refreshToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
            body: JSON.stringify({
                token: this.accessToken,
                refreshToken: this.refreshToken,
            }),
        });

        if (!res.ok) {
            throw new Error(`Token refresh failed (${res.status}).`);
        }

        const data = (await res.json()) as ValueDataResponse;
        if (data.isSuccess === false) {
            throw new Error("Token refresh rejected by server.");
        }
        this.setTokens(data.response ?? data);
    }

    /**
     * Apply a TokenViewModel payload. Field names are read defensively because
     * the envelope has shipped with minor casing variations over time.
     */
    private setTokens(payload: Record<string, unknown>): void {
        const str = (...keys: string[]): string | undefined => {
            for (const k of keys) {
                const v = payload[k];
                if (typeof v === "string" && v.length > 0) return v;
            }
            return undefined;
        };

        this.accessToken = str("accessToken", "token", "access_token") ?? this.accessToken;
        this.refreshToken =
            str("refreshToken", "refresh_token") ?? this.refreshToken;

        const expiresAtStr = str("expiresAt", "expriresAt", "expires_at");
        if (expiresAtStr) {
            this.expiresAt = new Date(expiresAtStr);
        } else {
            const minutes = Number(payload["minutes"] ?? payload["sessionTime"]) || 60;
            this.expiresAt = new Date(Date.now() + minutes * 60_000);
        }

        this.persist();
    }

    private persist(): void {
        const tokens: StoredTokens = {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresAt: this.expiresAt?.toISOString(),
        };
        this.store.save(tokens);
    }

    // ── HTTP ────────────────────────────────────────────────────────────────

    async get<T = unknown>(path: string, params?: QueryParams): Promise<T> {
        return this.request<T>("GET", path, undefined, params);
    }

    async post<T = unknown>(path: string, body?: unknown): Promise<T> {
        return this.request<T>("POST", path, body);
    }

    async put<T = unknown>(path: string, body?: unknown): Promise<T> {
        return this.request<T>("PUT", path, body);
    }

    async delete<T = unknown>(path: string): Promise<T> {
        return this.request<T>("DELETE", path);
    }

    private async request<T>(
        method: string,
        path: string,
        body?: unknown,
        params?: QueryParams
    ): Promise<T> {
        await this.authenticate();
        const res = await this.send(method, path, body, params);

        // One transparent retry on 401 — the token may have just expired.
        if (res.status === 401) {
            this.expiresAt = undefined;
            await this.authenticate();
            const retry = await this.send(method, path, body, params);
            return this.parse<T>(retry, path);
        }

        return this.parse<T>(res, path);
    }

    private send(
        method: string,
        path: string,
        body?: unknown,
        params?: QueryParams
    ): Promise<Response> {
        const url = new URL(`${this.cfg.baseUrl}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            }
        }

        return fetch(url.toString(), {
            method,
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    }

    private async parse<T>(res: Response, path: string): Promise<T> {
        if (!res.ok) {
            let errBody: unknown;
            try {
                errBody = await res.json();
            } catch {
                errBody = await res.text();
            }
            throw new KikoBooksApiError(
                `KikoBooks API ${res.status} on ${path}`,
                res.status,
                errBody
            );
        }

        const text = await res.text();
        if (!text) return undefined as T;
        return JSON.parse(text) as T;
    }
}

interface ValueDataResponse {
    isSuccess?: boolean;
    response?: Record<string, unknown>;
    [key: string]: unknown;
}

/**
 * Shared client instance. Constructed on first import (reads env via getConfig);
 * handlers call `kikoBooksClient.get(...)` etc.
 */
export const kikoBooksClient = new KikoBooksClient();
