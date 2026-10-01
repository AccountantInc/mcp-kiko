import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { deleteKikoBooksPurchase } from "../../handlers/delete-kikobooks-purchase.handler.js";

const toolSchema = z.object({
    purchase_id: z.number().describe("The Purchase/Expense ID to delete"),
});

const toolHandler = async (args: any) => {
    const response = await deleteKikoBooksPurchase(args.purchase_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error deleting purchase: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Purchase deleted:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const DeletePurchaseTool: ToolDefinition = {
    name: "delete_purchase",
    description:
        "Delete a purchase (expense) in KikoBooks.",
    schema: toolSchema,
    handler: toolHandler,
};
