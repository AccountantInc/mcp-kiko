import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksSalesReceipt } from "../../handlers/get-kikobooks-sales-receipt.handler.js";

const toolSchema = z.object({
    sales_receipt_id: z.number().describe("The sales receipt ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksSalesReceipt(args.sales_receipt_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting sales receipt: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Sales Receipt details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetSalesReceiptTool: ToolDefinition = {
    name: "get_sales_receipt",
    description:
        "Get a sales receipt by ID from KikoBooks. Returns full receipt details including line items and payment information.",
    schema: toolSchema,
    handler: toolHandler,
};
