import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Bank account ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/v2/bank/accounts/${args.id}`);
        return { content: [{ type: "text" as const, text: "Bank account:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting bank account: ${formatError(e)}` }] };
    }
};

export const GetBankAccountTool: ToolDefinition = {
    name: "get_bank_account",
    description: "Get full details of a single bank account by ID. Read-only.",
    schema,
    handler,
};
