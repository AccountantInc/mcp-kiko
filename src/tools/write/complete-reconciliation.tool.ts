import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Bank_ReconSession_Id to complete"),
    notes: z.string().optional().describe("Completion notes"),
    forceComplete: z.boolean().optional().describe("Complete even if a difference remains (use with care)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/v2/bank/reconciliation/sessions/${args.id}/complete`, {
            notes: args.notes,
            forceComplete: args.forceComplete,
        });
        return { content: [{ type: "text" as const, text: "Reconciliation completed:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error completing reconciliation: ${formatError(e)}` }] };
    }
};

export const CompleteReconciliationTool: ToolDefinition = {
    name: "complete_reconciliation",
    description:
        "Complete/finish a reconciliation session. Fails if a difference remains unless forceComplete is set. Confirm with the user first.",
    schema,
    handler,
};
