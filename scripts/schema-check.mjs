import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    env: { ...process.env, KIKOBOOKS_BASE_URL: "https://ai.kikobooks.com", KIKOBOOKS_API_KEY: "" },
});
const client = new Client({ name: "audit", version: "1.0.0" });
await client.connect(transport);
const { tools } = await client.listTools();
await client.close();

// Tools that are id-scoped (operate on one entity) and must expose an id-like param.
const idScoped = /^(get_|update_|delete_|void_|post_deposit|dispose_|pause_|resume_|activate_|generate_recurring|complete_|cancel_|set_|send_statement)/;
const idExempt =
    /^(get_connection_status|get_enabled_modules|get_pipeline|get_trial_balance|get_profit_and_loss|get_ar_aging|get_ap_aging|get_cash_position|get_expense_by_category|get_income_by_category|get_business_health|get_reconciliation_summary|get_organization_details)$/;

const anomalies = [];
for (const t of tools.sort((a, b) => a.name.localeCompare(b.name))) {
    const props = t.inputSchema?.properties ? Object.keys(t.inputSchema.properties) : [];
    const required = t.inputSchema?.required ?? [];
    const hasId = props.some((p) => p === "id" || /_?[Ii]d$/.test(p));
    if (idScoped.test(t.name) && !idExempt.test(t.name) && !hasId) {
        anomalies.push(`${t.name}: id-scoped but no id param`);
    }
    console.log(`${t.name.padEnd(34)} props=${String(props.length).padStart(2)} req=[${required.join(",")}]`);
}
console.log(`\nTOTAL: ${tools.length} tools`);
console.log(anomalies.length ? `ANOMALIES:\n  ${anomalies.join("\n  ")}` : "No id-scoping anomalies.");
