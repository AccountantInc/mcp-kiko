import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksBill } from "../../handlers/get-kikobooks-bill.handler.js";

const toolSchema = z.object({
    bill_id: z.number().describe("The Bill ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksBill(args.bill_id);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error getting bill: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Bill details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetBillTool: ToolDefinition = {
    name: "get_bill",
    description: "Get a single bill by ID from KikoBooks. Returns full bill details including line items, payment history, and balance due.",
    schema: toolSchema,
    handler: toolHandler,
};
