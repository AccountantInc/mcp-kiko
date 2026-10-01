import { config as loadEnv } from "dotenv";

loadEnv();

/**
 * Immutable runtime configuration for the KikoBooks MCP server.
 *
 * Credentials are read from the environment only. Nothing here is ever logged;
 * callers must never print `apiKey` or any token value.
 */
export interface KikoBooksConfig {
    /** API base URL, e.g. https://mcp.kikobooks.com (no trailing slash). */
    readonly baseUrl: string;
    /** Org API key ("kiko_..."). Exchanged for a JWT; never sent on data calls. */
    readonly apiKey?: string;
    /** Optional pre-supplied access token (skips the api-key exchange). */
    readonly accessToken?: string;
    /** Optional pre-supplied refresh token. */
    readonly refreshToken?: string;
    /**
     * Absolute, writable path for persisting the rotated JWT + refresh token
     * between runs. When unset, tokens live in memory only (re-auth each start).
     * The API key is NEVER written here.
     */
    readonly tokenStorePath?: string;
    /** When true, suppress all create_* tools at registration. */
    readonly disableWrite: boolean;
    /** When true, suppress all update_* tools at registration. */
    readonly disableUpdate: boolean;
    /** When true, suppress all delete_ and void_ tools at registration. */
    readonly disableDelete: boolean;
}

function boolEnv(name: string): boolean {
    const v = process.env[name];
    return v === "true" || v === "1";
}

let cached: KikoBooksConfig | undefined;

export function getConfig(): KikoBooksConfig {
    if (cached) return cached;

    const rawBase = process.env.KIKOBOOKS_BASE_URL;
    if (!rawBase) {
        throw new Error(
            "KIKOBOOKS_BASE_URL is required. Example: https://mcp.kikobooks.com"
        );
    }

    const tokenStorePath = process.env.KIKOBOOKS_TOKEN_STORE_PATH?.trim();
    if (tokenStorePath && !isAbsolutePath(tokenStorePath)) {
        throw new Error(
            "KIKOBOOKS_TOKEN_STORE_PATH must be an absolute path when set."
        );
    }

    cached = {
        baseUrl: rawBase.replace(/\/+$/, ""),
        apiKey: process.env.KIKOBOOKS_API_KEY?.trim() || undefined,
        accessToken: process.env.KIKOBOOKS_ACCESS_TOKEN?.trim() || undefined,
        refreshToken: process.env.KIKOBOOKS_REFRESH_TOKEN?.trim() || undefined,
        tokenStorePath: tokenStorePath || undefined,
        disableWrite: boolEnv("KIKOBOOKS_DISABLE_WRITE"),
        disableUpdate: boolEnv("KIKOBOOKS_DISABLE_UPDATE"),
        disableDelete: boolEnv("KIKOBOOKS_DISABLE_DELETE"),
    };

    return cached;
}

function isAbsolutePath(p: string): boolean {
    // Windows drive (C:\...) or UNC (\\...) or POSIX (/...).
    return /^(?:[a-zA-Z]:[\\/]|\\\\|\/)/.test(p);
}

/** Test seam — clears the memoized config so tests can re-read env. */
export function resetConfigForTests(): void {
    cached = undefined;
}
