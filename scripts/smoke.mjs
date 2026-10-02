#!/usr/bin/env node
/**
 * Live smoke test against a real KikoBooks org. Skips gracefully when no API
 * key is configured, so it is safe to run in any environment.
 *
 *   KIKOBOOKS_API_KEY=kiko_... npm run smoke
 *
 * It calls read-only tools only (no writes) and fails if the connection cannot
 * be established.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const apiKey = process.env.KIKOBOOKS_API_KEY?.trim();
if (!apiKey) {
    console.log("smoke: skipped — set KIKOBOOKS_API_KEY to run the live smoke test.");
    process.exit(0);
}

const baseUrl = process.env.KIKOBOOKS_BASE_URL || "https://ai.kikobooks.com";

const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    env: { ...process.env, KIKOBOOKS_BASE_URL: baseUrl, KIKOBOOKS_API_KEY: apiKey },
});
const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(transport);

async function call(name, args = {}) {
    const res = await client.callTool({ name, arguments: args });
    const text = (res.content || [])
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");
    return text;
}

let connected = false;
try {
    const status = await call("get_connection_status");
    console.log("get_connection_status:\n" + status);
    connected = /"connected":\s*true/.test(status) || /"status":\s*"connected"/.test(status);

    console.log("\nget_enabled_modules:\n" + (await call("get_enabled_modules")));

    // Read-only probes — small page sizes to keep output light.
    console.log("\nsearch_invoices (page 1):\n" + (await call("search_invoices", { pageSize: 3 })));
    console.log("\nsearch_customers (page 1):\n" + (await call("search_customers", { pageSize: 3 })));
} finally {
    await client.close();
}

if (!connected) {
    console.error("\nsmoke: FAILED — could not establish a connected session.");
    process.exit(1);
}
console.log("\nsmoke: connected and read tools returned data.");
