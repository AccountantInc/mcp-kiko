import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksPurchase } from "../../handlers/update-kikobooks-purchase.handler.js";

const toolSchema = z.object({
    purchase_id: z.number().describe("The Purchase/Expense ID to update"),
    purchase: z.object({
        memo: z.string().optional().describe("Updated memo"),
        referenceNumber: z.string().optional().describe("Updated reference number"),
        status: z.enum(["DRAFT", "PENDING", "VOIDED"]).optional().describe("Updated status"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksPurchase(args.purchase_id, args.purchase);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error updating purchase: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Purchase updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdatePurchaseTool: ToolDefinition = {
    name: "update_purchase",
    description:
        "Update an existing purchase (expense) in KikoBooks.",
    schema: toolSchema,
    handler: toolHandler,
};
