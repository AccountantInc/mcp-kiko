import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksBillPayment } from "../../handlers/create-kikobooks-bill-payment.handler.js";

const toolSchema = z.object({
    payment: z.object({
        AP_Vendor_Id: z.number().describe("Vendor ID to pay"),
        PaymentDate: z.string().describe("Payment date (YYYY-MM-DD)"),
        From_GL_Account_Id: z.number().describe("GL Account ID to pay from (bank/cash account)"),
        TotalPaidAmount: z.number().describe("Total payment amount"),
        AP_PaymentMethod_Id: z.number().optional().describe("Payment method ID"),
        GL_Account_Id: z.number().optional().describe("GL Account ID for AP"),
        CurrencyCode: z.string().optional().describe("Currency code (default: 'USD')"),
        CheckNumber: z.string().optional().describe("Check number"),
        CheckMemo: z.string().optional().describe("Memo printed on check"),
        Memo: z.string().optional().describe("Payment memo"),
        Notes: z.string().optional().describe("Internal notes"),
        AutoPost: z.boolean().optional().describe("Auto-post payment (default: true)"),
        Applications: z
            .array(
                z.object({
                    AP_Bill_Id: z.number().describe("Bill ID to apply payment to"),
                    AppliedAmount: z.number().describe("Amount applied to this bill"),
                    DiscountAmount: z.number().optional().describe("Discount amount taken"),
                    Memo: z.string().optional().describe("Application memo"),
                })
            )
            .optional()
            .describe("Bill applications for this payment"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksBillPayment(args.payment);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating bill payment: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "bill payment created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateBillPaymentTool: ToolDefinition = {
    name: "create_bill_payment",
    description:
        "Create a bill payment (AP) in KikoBooks. Requires vendor ID, payment date, source account, and amount. Optionally apply to specific bills.",
    schema: toolSchema,
    handler: toolHandler,
};
