import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksBillPayment } from "../../handlers/get-kikobooks-bill-payment.handler.js";

const toolSchema = z.object({
    payment_id: z.number().describe("The bill payment ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksBillPayment(args.payment_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting bill payment: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "bill payment details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetBillPaymentTool: ToolDefinition = {
    name: "get_bill_payment",
    description:
        "Get a bill payment (AP) by ID from KikoBooks. Returns full payment details including bill applications.",
    schema: toolSchema,
    handler: toolHandler,
};
