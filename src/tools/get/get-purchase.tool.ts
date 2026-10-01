import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksPurchase } from "../../handlers/get-kikobooks-purchase.handler.js";

const toolSchema = z.object({
    purchase_id: z.number().describe("The Purchase/Expense ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksPurchase(args.purchase_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting purchase: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Purchase details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetPurchaseTool: ToolDefinition = {
    name: "get_purchase",
    description:
        "Get a single purchase (expense) by ID from KikoBooks. Returns full purchase details.",
    schema: toolSchema,
    handler: toolHandler,
};
