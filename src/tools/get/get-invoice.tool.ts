import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksInvoice } from "../../handlers/get-kikobooks-invoice.handler.js";

const toolSchema = z.object({
    invoice_id: z.number().describe("The Invoice ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksInvoice(args.invoice_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting invoice: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Invoice details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetInvoiceTool: ToolDefinition = {
    name: "get_invoice",
    description:
        "Get a single invoice by ID from KikoBooks. Returns full invoice details including line items, payments, credits, and balance due.",
    schema: toolSchema,
    handler: toolHandler,
};
