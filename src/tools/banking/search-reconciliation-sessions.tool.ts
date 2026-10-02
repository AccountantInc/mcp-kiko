import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    accountId: z.number().optional().describe("Filter reconciliation sessions to a single bank account ID"),
    status: z.string().optional().describe("Filter by session status (e.g. InProgress / Completed)"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 20)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/v2/bank/reconciliation/sessions", {
            accountId: args.accountId,
            status: args.status,
            page: args.page,
            pageSize: args.pageSize,
        });
        return { content: [{ type: "text" as const, text: "Reconciliation sessions:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching reconciliation sessions: ${formatError(e)}` }] };
    }
};

export const SearchReconciliationSessionsTool: ToolDefinition = {
    name: "search_reconciliation_sessions",
    description:
        "Search bank reconciliation sessions (open and completed) with filters by account and status. Read-only.",
    schema,
    handler,
};
