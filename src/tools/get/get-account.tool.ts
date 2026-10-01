import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksAccount } from "../../handlers/get-kikobooks-account.handler.js";

const toolSchema = z.object({
    account_id: z.number().describe("The GL Account ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksAccount(args.account_id);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error getting account: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Account details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetAccountTool: ToolDefinition = {
    name: "get_account",
    description:
        "Get a single chart of accounts entry by ID from KikoBooks. Returns full account details including balances, hierarchy, and metadata.",
    schema: toolSchema,
    handler: toolHandler,
};
