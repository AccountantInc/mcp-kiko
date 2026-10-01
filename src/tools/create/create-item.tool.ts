import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksItem } from "../../handlers/create-kikobooks-item.handler.js";

const toolSchema = z.object({
    item: z.object({
        name: z.string().describe("Item name"),
        description: z.string().optional().describe("Item description"),
        type: z.enum(["SERVICE", "INVENTORY", "NON_INVENTORY"]).optional().describe("Item type"),
        unitPrice: z.number().optional().describe("Default selling price"),
        costPrice: z.number().optional().describe("Default cost/purchase price"),
        incomeAccountId: z.number().optional().describe("GL Account for income"),
        expenseAccountId: z.number().optional().describe("GL Account for expenses"),
        taxable: z.boolean().optional().describe("Whether the item is taxable"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksItem(args.item);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error creating item: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Item created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateItemTool: ToolDefinition = {
    name: "create_item",
    description: "Create a new product/service item in KikoBooks. Requires a name. Optionally include pricing, type, and account mappings.",
    schema: toolSchema,
    handler: toolHandler,
};
