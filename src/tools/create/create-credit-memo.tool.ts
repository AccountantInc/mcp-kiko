import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksCreditMemo } from "../../handlers/create-kikobooks-credit-memo.handler.js";

const toolSchema = z.object({
    creditMemo: z.object({
        Customer_Id: z.number().describe("Customer ID for this credit memo"),
        CreditMemoDate: z.string().describe("Credit memo date (YYYY-MM-DD)"),
        ReasonCode: z.string().describe("Reason code for the credit (e.g., 'RETURN', 'PRICING_ERROR', 'DAMAGED')"),
        ReasonDescription: z.string().optional().describe("Detailed reason description"),
        AR_Invoice_Id: z.number().optional().describe("Related invoice ID (if crediting a specific invoice)"),
        CurrencyCode: z.string().optional().describe("Currency code (default: 'USD')"),
        MessageToCustomer: z.string().optional().describe("Message visible to customer"),
        InternalMemo: z.string().optional().describe("Internal memo (not visible to customer)"),
        GL_ARAccount_Id: z.number().optional().describe("AR account ID override"),
        Lines: z
            .array(
                z.object({
                    LineType: z.string().optional().describe("Line type"),
                    AR_Item_Id: z.number().optional().describe("Item/product ID"),
                    ItemCode: z.string().optional().describe("Item code"),
                    Description: z.string().describe("Line item description"),
                    Quantity: z.number().describe("Quantity"),
                    UnitPrice: z.number().describe("Unit price"),
                    Amount: z.number().describe("Line amount"),
                    IsTaxable: z.boolean().optional().describe("Is this line taxable"),
                    TaxCode: z.string().optional().describe("Tax code"),
                    GL_Account_Id: z.number().optional().describe("GL Account ID for this line"),
                })
            )
            .describe("Credit memo line items"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksCreditMemo(args.creditMemo);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating credit memo: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Credit Memo created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateCreditMemoTool: ToolDefinition = {
    name: "create_credit_memo",
    description:
        "Create a credit memo (AR) in KikoBooks. Requires customer ID, date, reason code, and at least one line item. Can be linked to a specific invoice.",
    schema: toolSchema,
    handler: toolHandler,
};
