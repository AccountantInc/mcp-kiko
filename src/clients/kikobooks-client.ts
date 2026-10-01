import { config } from "dotenv";
config();

import { getClientHeaders } from "../helpers/get-client-headers.js";

interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
}

class KikoBooksClient {
    private readonly baseUrl: string;
    private readonly apiKey?: string;
    private accessToken?: string;
    private refreshToken?: string;
    private tokenExpiresAt?: Date;
    private isAuthenticating: boolean = false;

    constructor() {
        const baseUrl = process.env.KIKOBOOKS_BASE_URL;
        if (!baseUrl) {
            throw new Error(
                "KIKOBOOKS_BASE_URL environment variable is required. " +
                "Example: https://mcp.kikobooks.com"
            );
        }
        this.baseUrl = baseUrl.replace(/\/+$/, ""); // Remove trailing slashes

        this.apiKey = process.env.KIKOBOOKS_API_KEY;
        this.accessToken = process.env.KIKOBOOKS_ACCESS_TOKEN;
        this.refreshToken = process.env.KIKOBOOKS_REFRESH_TOKEN;
    }

    /**
     * Ensures we have a valid access token before making API calls.
     */
    async authenticate(): Promise<void> {
        // Prevent concurrent auth attempts
        if (this.isAuthenticating) {
            await new Promise<void>((resolve) => {
                const check = setInterval(() => {
                    if (!this.isAuthenticating) {
                        clearInterval(check);
                        resolve();
                    }
                }, 100);
            });
            return;
        }

        // If we have a valid token, skip
        if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
            return;
        }

        this.isAuthenticating = true;

        try {
            if (this.refreshToken) {
                await this.refreshAccessToken();
            } else if (this.apiKey) {
                await this.authenticateWithApiKey();
            } else if (this.accessToken) {
                // Direct token provided, assume it's valid
                // Set a generous expiry if not known
                if (!this.tokenExpiresAt) {
                    this.tokenExpiresAt = new Date(Date.now() + 3600 * 1000);
                }
                return;
            } else {
                throw new Error(
                    "No authentication credentials found. " +
                    "Set KIKOBOOKS_API_KEY or KIKOBOOKS_ACCESS_TOKEN in your environment."
                );
            }
        } finally {
            this.isAuthenticating = false;
        }
    }

    /**
     * Authenticate using an API key — exchanges for JWT tokens.
     */
    private async authenticateWithApiKey(): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/Auth/api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey: this.apiKey }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(
                `Authentication failed (${response.status}): ${text}`
            );
        }

        const data = await response.json();

        // KikoBooks wraps responses in ValueDataResponse { isSuccess, response: { ... } }
        if (data.isSuccess === false) {
            throw new Error(
                `Authentication failed: ${data.endUserMessage || "Invalid API key"}`
            );
        }

        const tokenData = data.response || data;
        this.setTokens(tokenData);
    }

    /**
     * Refresh an expired access token using the refresh token.
     */
    private async refreshAccessToken(): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/Token/refreshToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: this.accessToken,
                refreshToken: this.refreshToken,
            }),
        });

        if (!response.ok) {
            // Refresh failed — try API key if available
            if (this.apiKey) {
                this.refreshToken = undefined;
                await this.authenticateWithApiKey();
                return;
            }
            throw new Error(
                `Token refresh failed (${response.status}). Re-authenticate.`
            );
        }

        const data = await response.json();
        const tokenData = data.response || data;
        this.setTokens(tokenData);
    }

    private setTokens(data: any): void {
        this.accessToken = data.accessToken || data.token || data.access_token;
        this.refreshToken =
            data.refreshToken || data.refresh_token || this.refreshToken;

        // KikoBooks returns expriresAt (datetime) or expiresIn (seconds)
        if (data.expriresAt || data.expiresAt) {
            this.tokenExpiresAt = new Date(data.expriresAt || data.expiresAt);
        } else {
            const expiresIn = data.expiresIn || data.expires_in || data.sessionTime
                ? (data.sessionTime || 60) * 60
                : 3600;
            this.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
        }
    }

    /**
     * Make an authenticated GET request to the KikoBooks API.
     */
    async get<T = any>(
        path: string,
        params?: Record<string, string | number | boolean | undefined>
    ): Promise<T> {
        await this.authenticate();

        const url = new URL(`${this.baseUrl}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            }
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                ...getClientHeaders(),
            },
        });

        if (!response.ok) {
            const error = new Error(`API request failed: ${path}`) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            const bodyText = await response.text();
            try {
                error.body = JSON.parse(bodyText);
            } catch {
                error.body = bodyText;
            }
            throw error;
        }

        return response.json();
    }

    /**
     * Make an authenticated POST request to the KikoBooks API.
     */
    async post<T = any>(path: string, body: any): Promise<T> {
        await this.authenticate();

        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                ...getClientHeaders(),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = new Error(`API request failed: ${path}`) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            const bodyText = await response.text();
            try {
                error.body = JSON.parse(bodyText);
            } catch {
                error.body = bodyText;
            }
            throw error;
        }

        return response.json();
    }

    /**
     * Make an authenticated PUT request to the KikoBooks API.
     */
    async put<T = any>(path: string, body: any): Promise<T> {
        await this.authenticate();

        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                ...getClientHeaders(),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = new Error(`API request failed: ${path}`) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            const bodyText = await response.text();
            try {
                error.body = JSON.parse(bodyText);
            } catch {
                error.body = bodyText;
            }
            throw error;
        }

        return response.json();
    }

    /**
     * Make an authenticated DELETE request to the KikoBooks API.
     */
    async delete<T = any>(path: string): Promise<T> {
        await this.authenticate();

        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
                ...getClientHeaders(),
            },
        });

        if (!response.ok) {
            const error = new Error(`API request failed: ${path}`) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            const bodyText = await response.text();
            try {
                error.body = JSON.parse(bodyText);
            } catch {
                error.body = bodyText;
            }
            throw error;
        }

        // Some DELETE endpoints return 204 No Content
        const text = await response.text();
        if (!text) return { success: true } as T;
        return JSON.parse(text);
    }
}

// Singleton instance
export const kikoBooksClient = new KikoBooksClient();
