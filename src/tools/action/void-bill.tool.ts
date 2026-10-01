import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { voidKikoBooksBill } from "../../handlers/void-kikobooks-bill.handler.js";

const toolSchema = z.object({
    bill_id: z.number().describe("The Bill ID to void"),
});

const toolHandler = async (args: any) => {
    const response = await voidKikoBooksBill(args.bill_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error voiding bill: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Bill voided:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const VoidBillTool: ToolDefinition = {
    name: "void_bill",
    description:
        "Void a bill in KikoBooks. Voiding marks the bill as cancelled and reverses any accounting impact. Only applicable to posted bills.",
    schema: toolSchema,
    handler: toolHandler,
};
