import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksSalesReceipt } from "../../handlers/create-kikobooks-sales-receipt.handler.js";

const toolSchema = z.object({
    salesReceipt: z.object({
        Customer_Id: z.number().optional().describe("Customer ID (optional for walk-in sales)"),
        ReceiptDate: z.string().describe("Receipt date (YYYY-MM-DD)"),
        PaymentMethodCode: z.string().optional().describe("Payment method code (e.g., 'CASH', 'CREDIT_CARD', 'CHECK')"),
        ReferenceNumber: z.string().optional().describe("External reference number"),
        CurrencyCode: z.string().optional().describe("Currency code (default: 'USD')"),
        DepositToAccount_Id: z.number().optional().describe("GL Account ID for the deposit"),
        DepositDate: z.string().optional().describe("Deposit date (YYYY-MM-DD)"),
        BillToName: z.string().optional().describe("Bill-to name"),
        BillToEmail: z.string().optional().describe("Bill-to email address"),
        MessageToCustomer: z.string().optional().describe("Message visible to customer"),
        InternalMemo: z.string().optional().describe("Internal memo"),
        Lines: z
            .array(
                z.object({
                    LineType: z.string().optional().describe("Line type"),
                    AR_Item_Id: z.number().optional().describe("Item/product ID"),
                    ItemCode: z.string().optional().describe("Item code"),
                    ItemName: z.string().optional().describe("Item name"),
                    Description: z.string().optional().describe("Line item description"),
                    Quantity: z.number().describe("Quantity"),
                    UnitPrice: z.number().describe("Unit price"),
                    Amount: z.number().describe("Line amount"),
                    IsTaxable: z.boolean().optional().describe("Is this line taxable"),
                    TaxCode: z.string().optional().describe("Tax code"),
                    GL_Account_Id: z.number().optional().describe("GL Account ID for this line"),
                })
            )
            .describe("Sales receipt line items"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksSalesReceipt(args.salesReceipt);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating sales receipt: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Sales Receipt created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateSalesReceiptTool: ToolDefinition = {
    name: "create_sales_receipt",
    description:
        "Create a sales receipt in KikoBooks. Sales receipts record instant payment+sale in one step (no separate invoice needed). Requires date and at least one line item.",
    schema: toolSchema,
    handler: toolHandler,
};
