import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Persisted session tokens. Short-lived JWT + rotating refresh token only.
 * The org API key is NEVER persisted here — it stays in the environment.
 */
export interface StoredTokens {
    accessToken?: string;
    refreshToken?: string;
    /** ISO-8601 UTC expiry of the access token. */
    expiresAt?: string;
}

/**
 * File-backed token cache. When no path is configured, nothing is persisted and
 * the server re-authenticates with the API key on each start.
 *
 * On disk the file is created 0600 (owner read/write) on POSIX; on Windows the
 * chmod is a no-op but the path should still be a private, user-scoped location.
 */
export class TokenStore {
    constructor(private readonly path?: string) {}

    load(): StoredTokens {
        if (!this.path) return {};
        try {
            const raw = readFileSync(this.path, "utf8");
            const parsed = JSON.parse(raw) as StoredTokens;
            return {
                accessToken: parsed.accessToken,
                refreshToken: parsed.refreshToken,
                expiresAt: parsed.expiresAt,
            };
        } catch {
            // Missing/corrupt store is non-fatal — treat as empty.
            return {};
        }
    }

    save(tokens: StoredTokens): void {
        if (!this.path) return;
        try {
            mkdirSync(dirname(this.path), { recursive: true });
            writeFileSync(this.path, JSON.stringify(tokens), { mode: 0o600 });
            try {
                chmodSync(this.path, 0o600);
            } catch {
                // chmod is best-effort (no-op on Windows).
            }
        } catch (err) {
            // Never throw on persistence failure — the session still works in-memory.
            process.stderr.write(
                `kikobooks-mcp: token store write failed: ${(err as Error).message}\n`
            );
        }
    }
}
