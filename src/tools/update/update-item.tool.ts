import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksItem } from "../../handlers/update-kikobooks-item.handler.js";

const toolSchema = z.object({
    item_id: z.number().describe("The Item ID to update"),
    item: z.object({
        name: z.string().optional().describe("Updated item name"),
        description: z.string().optional().describe("Updated description"),
        unitPrice: z.number().optional().describe("Updated selling price"),
        costPrice: z.number().optional().describe("Updated cost price"),
        taxable: z.boolean().optional().describe("Updated taxable status"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksItem(args.item_id, args.item);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error updating item: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Item updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateItemTool: ToolDefinition = {
    name: "update_item",
    description: "Update an existing product/service item in KikoBooks.",
    schema: toolSchema,
    handler: toolHandler,
};
