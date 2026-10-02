import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

// Mirrors StartReconSessionDto
const schema = z.object({
    bank_Account_Id: z.number().describe("Bank_Account_Id to reconcile"),
    periodStart: z.string().describe("Statement period start (YYYY-MM-DD)"),
    periodEnd: z.string().describe("Statement period end (YYYY-MM-DD)"),
    statementBalance: z.number().describe("Closing statement balance from the bank statement"),
    notes: z.string().optional().describe("Optional notes"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post("/api/v2/bank/reconciliation/sessions", args);
        return { content: [{ type: "text" as const, text: "Reconciliation session started:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error starting reconciliation: ${formatError(e)}` }] };
    }
};

export const StartReconciliationTool: ToolDefinition = {
    name: "start_reconciliation",
    description:
        "Start a bank reconciliation session for an account over a statement period, seeded with the closing statement balance. Confirm with the user first.",
    schema,
    handler,
};
