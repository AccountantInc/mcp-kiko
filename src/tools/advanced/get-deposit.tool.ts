import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Deposit ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/Deposits/${args.id}`);
        return { content: [{ type: "text" as const, text: "Deposit:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting deposit: ${formatError(e)}` }] };
    }
};

export const GetDepositTool: ToolDefinition = {
    name: "get_deposit",
    description: "Get full details of a single bank deposit by ID, including its allocated payments. Read-only.",
    schema,
    handler,
};
