import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Bank_ReconSession_Id to cancel"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/v2/bank/reconciliation/sessions/${args.id}/cancel`);
        return { content: [{ type: "text" as const, text: "Reconciliation cancelled:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error cancelling reconciliation: ${formatError(e)}` }] };
    }
};

export const CancelReconciliationTool: ToolDefinition = {
    name: "cancel_reconciliation",
    description: "Cancel an in-progress reconciliation session (discards its clearing state). Confirm with the user first.",
    schema,
    handler,
};
