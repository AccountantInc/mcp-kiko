import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { voidKikoBooksBillPayment } from "../../handlers/void-kikobooks-bill-payment.handler.js";

const toolSchema = z.object({
    payment_id: z.number().describe("The Bill Payment ID to void"),
});

const toolHandler = async (args: any) => {
    const response = await voidKikoBooksBillPayment(args.payment_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error voiding bill payment: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Bill payment voided:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const VoidBillPaymentTool: ToolDefinition = {
    name: "void_bill_payment",
    description:
        "Void a bill payment (vendor payment) in KikoBooks. Voiding reverses the payment's accounting impact without physically deleting the record.",
    schema: toolSchema,
    handler: toolHandler,
};
