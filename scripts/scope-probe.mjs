#!/usr/bin/env node
/**
 * Server-side API-key SCOPE probe for KikoBooks.
 *
 * Proves the ApiKeyScopeEnforcementMiddleware end-to-end against a live host,
 * WITHOUT creating any records: the read-only write is rejected (403) before it
 * reaches a handler, and the read-write write is sent with a deliberately empty
 * body so the server answers 400 (validation) rather than persisting anything —
 * either way we only assert whether the SCOPE gate allowed the verb through.
 *
 * Required env (never pass keys on the command line or in chat):
 *   KIKOBOOKS_BASE_URL   e.g. https://ai.kikobooks.com
 *   KIKO_RO_KEY          a Read-only API key
 *   KIKO_RW_KEY          a Read & write API key
 *
 * Run:  node scripts/scope-probe.mjs
 */

const baseUrl = (process.env.KIKOBOOKS_BASE_URL || "https://ai.kikobooks.com").replace(/\/+$/, "");
const roKey = process.env.KIKO_RO_KEY?.trim();
const rwKey = process.env.KIKO_RW_KEY?.trim();

const READ_PATH = "/api/Customers";          // GET list — allowed for any key
const WRITE_PATH = "/api/Customers/create";  // POST — gated by scope

const failures = [];
function check(label, condition, detail = "") {
    const tag = condition ? "PASS" : "FAIL";
    console.log(`  ${tag}  ${label}${detail ? `  — ${detail}` : ""}`);
    if (!condition) failures.push(label);
}

async function exchangeApiKey(apiKey) {
    const res = await fetch(`${baseUrl}/api/Auth/api-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
    });
    if (!res.ok) throw new Error(`api-key exchange failed (${res.status})`);
    const data = await res.json();
    const t = data.response ?? data;
    const token = t.token ?? t.accessToken ?? t.Token ?? t.AccessToken;
    const refreshToken = t.refreshToken ?? t.RefreshToken;
    if (!token) throw new Error("no access token in exchange response");
    return { token, refreshToken };
}

async function call(method, path, token, body) {
    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    return res.status;
}

async function refresh(token, refreshToken) {
    const res = await fetch(`${baseUrl}/api/Token/refreshToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, refreshToken }),
    });
    if (!res.ok) throw new Error(`refresh failed (${res.status})`);
    const data = await res.json();
    const t = data.response ?? data;
    return {
        token: t.token ?? t.accessToken ?? t.Token ?? t.AccessToken,
        refreshToken: t.refreshToken ?? t.RefreshToken ?? refreshToken,
    };
}

async function main() {
    console.log(`Scope probe → ${baseUrl}`);
    if (!roKey || !rwKey) {
        console.log("SKIPPED — set KIKO_RO_KEY and KIKO_RW_KEY to run.");
        process.exit(0);
    }

    const ro = await exchangeApiKey(roKey);
    const rw = await exchangeApiKey(rwKey);
    console.log("  (both keys exchanged for JWTs)\n");

    // 1. Read-only key can read.
    const roRead = await call("GET", READ_PATH, ro.token);
    check("read-only key: GET read → 200", roRead === 200, `got ${roRead}`);

    // 2. Read-only key is blocked on write (403, before any handler — no record created).
    const roWrite = await call("POST", WRITE_PATH, ro.token, {});
    check("read-only key: POST write → 403 (scope block)", roWrite === 403, `got ${roWrite}`);

    // 3. Read-write key is NOT scope-blocked (empty body → 400 validation, or 200/201; never 403).
    const rwWrite = await call("POST", WRITE_PATH, rw.token, {});
    check("read-write key: POST write → not 403 (scope allows)", rwWrite !== 403 && rwWrite !== 401, `got ${rwWrite}`);

    // 4. After refresh, the read-only scope is re-asserted (still 403 on write).
    const ro2 = await refresh(ro.token, ro.refreshToken);
    const roWrite2 = await call("POST", WRITE_PATH, ro2.token, {});
    check("read-only key: still 403 after token refresh", roWrite2 === 403, `got ${roWrite2}`);

    console.log("");
    if (failures.length) {
        console.error(`SCOPE PROBE FAILED — ${failures.length} check(s) failed.`);
        if (roWrite === 200 || roWrite === 201) {
            console.error("NOTE: read-only POST succeeded — the scope-enforcement feature is NOT deployed to this host yet (deploy MS=39).");
        }
        process.exit(1);
    }
    console.log("SCOPE PROBE PASSED — read-only is read-only, read-write can write, scope survives refresh.");
}

main().catch((e) => {
    console.error("scope probe error:", e.message);
    process.exit(2);
});
