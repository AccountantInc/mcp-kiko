import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksPayment } from "../../handlers/create-kikobooks-payment.handler.js";

const toolSchema = z.object({
    payment: z.object({
        Customer_Id: z.number().describe("Customer ID receiving the payment"),
        PaymentDate: z.string().describe("Payment date (YYYY-MM-DD)"),
        PaymentMethodCode: z.string().describe("Payment method code (e.g., 'CHECK', 'CREDIT_CARD', 'ACH', 'CASH')"),
        PaymentType: z.string().optional().describe("Payment type"),
        Amount: z.number().describe("Payment amount"),
        CurrencyCode: z.string().optional().describe("Currency code (default: 'USD')"),
        CheckNumber: z.string().optional().describe("Check number for check payments"),
        ReferenceNumber: z.string().optional().describe("External reference number"),
        Memo: z.string().optional().describe("Payment memo"),
        InternalNotes: z.string().optional().describe("Internal notes (not visible to customer)"),
        DepositToAccount_Id: z.number().optional().describe("GL Account ID for deposit"),
        Bank_Account_Id: z.number().optional().describe("Bank account ID"),
        AutoPost: z.boolean().optional().describe("Auto-post payment after creation (default: false)"),
        Allocations: z
            .array(
                z.object({
                    AR_Invoice_Id: z.number().optional().describe("Invoice ID to apply payment to"),
                    AR_CreditMemo_Id: z.number().optional().describe("Credit memo ID to apply"),
                    AllocatedAmount: z.number().describe("Amount allocated to this invoice/credit memo"),
                    DiscountTaken: z.number().optional().describe("Discount amount taken"),
                })
            )
            .optional()
            .describe("Payment allocations to invoices"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksPayment(args.payment);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating payment: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Payment created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreatePaymentTool: ToolDefinition = {
    name: "create_payment",
    description:
        "Create a customer payment (AR) in KikoBooks. Requires customer ID, date, method, and amount. Optionally allocate to specific invoices.",
    schema: toolSchema,
    handler: toolHandler,
};
