#!/usr/bin/env node
/**
 * Regression guard: launches the built server over stdio, lists tools, and
 * asserts the catalog + scope-tier gating. Requires no API key (listing tools
 * does not authenticate). Exits non-zero on any failure so it can gate CI.
 *
 *   npm run verify
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function listTools(env) {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["dist/index.js"],
        env: {
            ...process.env,
            KIKOBOOKS_BASE_URL: "https://ai.kikobooks.com",
            KIKOBOOKS_API_KEY: "",
            ...env,
        },
    });
    const client = new Client({ name: "verify", version: "1.0.0" });
    await client.connect(transport);
    const { tools } = await client.listTools();
    await client.close();
    return tools;
}

const failures = [];
function check(label, condition) {
    if (condition) {
        console.log(`  PASS  ${label}`);
    } else {
        console.log(`  FAIL  ${label}`);
        failures.push(label);
    }
}

const EXPECTED_READS = [
    "get_connection_status",
    "get_enabled_modules",
    "search_invoices",
    "search_customers",
    "search_leads",
    "get_pipeline",
    "search_proposals",
    "search_jobs",
    "list_job_tasks",
    "get_trial_balance",
    "get_profit_and_loss",
    "get_ar_aging",
    "get_ap_aging",
    "search_bank_accounts",
    "search_bank_transactions",
    "search_deposits",
    "search_fixed_assets",
    "get_organization_details",
];
const WRITE_TOOLS = [
    "create_customer",
    "create_lead",
    "create_deal",
    "move_deal_stage",
    "promote_deal_to_customer",
    "copy_proposal",
    "generate_invoice_from_proposal",
    "create_job_from_proposal",
    "generate_invoice_from_job",
    "create_deposit",
    "run_depreciation",
    "start_reconciliation",
    "post_deposit",
    "dispose_fixed_asset",
];
const UPDATE_TOOLS = ["update_deal", "update_job_status", "update_task_status", "update_deposit", "update_fixed_asset"];
const DELETE_TOOLS = ["delete_customer", "void_bill", "delete_deposit", "void_deposit", "delete_statement"];

const allTools = await listTools({});
const all = allTools.map((t) => t.name);
const noWrite = (await listTools({ KIKOBOOKS_DISABLE_WRITE: "true" })).map((t) => t.name);
const noUpdate = (await listTools({ KIKOBOOKS_DISABLE_UPDATE: "true" })).map((t) => t.name);
const noDelete = (await listTools({ KIKOBOOKS_DISABLE_DELETE: "true" })).map((t) => t.name);

console.log(`Tool catalog: ${all.length} tools`);

check("catalog has at least 116 tools", all.length >= 116);
for (const t of EXPECTED_READS) check(`read tool present: ${t}`, all.includes(t));

check(
    "DISABLE_WRITE suppresses all write-tier tools",
    WRITE_TOOLS.every((t) => all.includes(t) && !noWrite.includes(t))
);
check(
    "DISABLE_UPDATE suppresses all update tools",
    UPDATE_TOOLS.every((t) => all.includes(t) && !noUpdate.includes(t))
);
check(
    "DISABLE_DELETE suppresses all delete/void tools",
    DELETE_TOOLS.every((t) => all.includes(t) && !noDelete.includes(t))
);
check(
    "read tools are never suppressed by write/update/delete flags",
    EXPECTED_READS.every(
        (t) => noWrite.includes(t) && noUpdate.includes(t) && noDelete.includes(t)
    )
);

// Regression guard: parameterized tools MUST expose their input-schema properties.
// (Passing a ZodObject instead of its raw shape to server.tool() silently yields an
// empty schema — agents then can't see any parameters.)
const PARAMETERIZED = {
    search_invoices: ["status", "customerId"],
    create_deposit: ["depositDate", "bank_Account_Id", "lines"],
    run_depreciation: ["fiscalYear", "periodNumber"],
    start_reconciliation: ["bank_Account_Id", "statementBalance"],
    create_fixed_asset: ["assetName", "acquisitionCost"],
};
for (const [name, expected] of Object.entries(PARAMETERIZED)) {
    const t = allTools.find((x) => x.name === name);
    const props = t?.inputSchema?.properties ? Object.keys(t.inputSchema.properties) : [];
    check(
        `input schema exposes params: ${name}`,
        expected.every((p) => props.includes(p))
    );
}

if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed.`);
    process.exit(1);
}
console.log("\nAll checks passed.");
