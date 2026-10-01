import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksItem } from "../../handlers/get-kikobooks-item.handler.js";

const toolSchema = z.object({
    item_id: z.number().describe("The Item ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksItem(args.item_id);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error getting item: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Item details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetItemTool: ToolDefinition = {
    name: "get_item",
    description: "Get a single product/service item by ID from KikoBooks. Returns full item details including pricing and account mapping.",
    schema: toolSchema,
    handler: toolHandler,
};
