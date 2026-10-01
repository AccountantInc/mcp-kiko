import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksPurchase } from "../../handlers/create-kikobooks-purchase.handler.js";

const toolSchema = z.object({
    purchase: z.object({
        vendorId: z.number().optional().describe("Vendor ID for the purchase"),
        expenseDate: z.string().describe("Expense date (YYYY-MM-DD)"),
        paymentAccountId: z.number().optional().describe("GL Account ID for payment (bank/cash account)"),
        lineItems: z.array(z.object({
            description: z.string().describe("Line item description"),
            amount: z.number().describe("Line item amount"),
            accountId: z.number().optional().describe("GL Account ID for the expense category"),
            taxCode: z.string().optional().describe("Tax code"),
        })).describe("Line items for the purchase"),
        memo: z.string().optional().describe("Memo or notes"),
        referenceNumber: z.string().optional().describe("Reference number"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksPurchase(args.purchase);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating purchase: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Purchase created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreatePurchaseTool: ToolDefinition = {
    name: "create_purchase",
    description:
        "Create a purchase (expense) in KikoBooks. Requires expense date and line items with amounts and expense accounts.",
    schema: toolSchema,
    handler: toolHandler,
};
