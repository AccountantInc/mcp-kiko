import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksPayment } from "../../handlers/get-kikobooks-payment.handler.js";

const toolSchema = z.object({
    payment_id: z.number().describe("The payment ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksPayment(args.payment_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting payment: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Payment details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetPaymentTool: ToolDefinition = {
    name: "get_payment",
    description:
        "Get a customer payment (AR) by ID from KikoBooks. Returns full payment details including allocations to invoices.",
    schema: toolSchema,
    handler: toolHandler,
};
