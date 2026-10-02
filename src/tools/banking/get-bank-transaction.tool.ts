import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Bank transaction ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/v2/bank/transactions/${args.id}`);
        return { content: [{ type: "text" as const, text: "Bank transaction:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting bank transaction: ${formatError(e)}` }] };
    }
};

export const GetBankTransactionTool: ToolDefinition = {
    name: "get_bank_transaction",
    description: "Get full details of a single imported bank transaction by ID. Read-only.",
    schema,
    handler,
};
