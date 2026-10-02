import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Bank_ReconSession_Id to update"),
    statementBalance: z.number().describe("New closing statement balance"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.put(`/api/v2/bank/reconciliation/sessions/${args.id}/statement-balance`, {
            statementBalance: args.statementBalance,
        });
        return { content: [{ type: "text" as const, text: "Statement balance updated:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error updating statement balance: ${formatError(e)}` }] };
    }
};

export const SetStatementBalanceTool: ToolDefinition = {
    name: "set_statement_balance",
    description: "Update the closing statement balance on an in-progress reconciliation session. Confirm with the user first.",
    schema,
    handler,
};
