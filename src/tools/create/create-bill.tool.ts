import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksBill } from "../../handlers/create-kikobooks-bill.handler.js";

const toolSchema = z.object({
    bill: z.object({
        vendorId: z.number().describe("Vendor ID for this bill"),
        billDate: z.string().describe("Bill date (YYYY-MM-DD)"),
        dueDate: z.string().describe("Due date (YYYY-MM-DD)"),
        billNumber: z.string().optional().describe("Bill/reference number"),
        lineItems: z
            .array(
                z.object({
                    description: z.string().describe("Line item description"),
                    amount: z.number().describe("Line amount"),
                    accountId: z.number().optional().describe("GL Account ID for expense"),
                    taxCode: z.string().optional().describe("Tax code"),
                })
            )
            .describe("Bill line items"),
        memo: z.string().optional().describe("Internal memo"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksBill(args.bill);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error creating bill: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Bill created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateBillTool: ToolDefinition = {
    name: "create_bill",
    description: "Create a new bill (accounts payable) in KikoBooks. Requires vendor ID, dates, and line items.",
    schema: toolSchema,
    handler: toolHandler,
};
