import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({});

const handler = async () => {
    try {
        const res = await kikoBooksClient.get("/api/v2/bank/reconciliation/summary");
        return { content: [{ type: "text" as const, text: "Reconciliation summary:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting reconciliation summary: ${formatError(e)}` }] };
    }
};

export const GetReconciliationSummaryTool: ToolDefinition = {
    name: "get_reconciliation_summary",
    description:
        "Get the bank reconciliation summary across accounts — matched/unmatched counts and cleared balances. Read-only.",
    schema,
    handler,
};
