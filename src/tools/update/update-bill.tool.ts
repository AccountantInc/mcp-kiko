import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksBill } from "../../handlers/update-kikobooks-bill.handler.js";

const toolSchema = z.object({
    bill_id: z.number().describe("The Bill ID to update"),
    bill: z.object({
        dueDate: z.string().optional().describe("Updated due date (YYYY-MM-DD)"),
        billNumber: z.string().optional().describe("Updated bill number"),
        memo: z.string().optional().describe("Updated memo"),
        status: z
            .enum(["DRAFT", "PENDING", "APPROVED", "VOIDED"])
            .optional()
            .describe("Updated status"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksBill(args.bill_id, args.bill);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error updating bill: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Bill updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateBillTool: ToolDefinition = {
    name: "update_bill",
    description: "Update an existing bill in KikoBooks. Only DRAFT/PENDING bills can be fully edited.",
    schema: toolSchema,
    handler: toolHandler,
};
