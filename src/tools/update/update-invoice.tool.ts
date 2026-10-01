import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksInvoice } from "../../handlers/update-kikobooks-invoice.handler.js";

const toolSchema = z.object({
    invoice_id: z.number().describe("The Invoice ID to update"),
    invoice: z.object({
        dueDate: z.string().optional().describe("Updated due date (YYYY-MM-DD)"),
        termsCode: z.string().optional().describe("Updated payment terms"),
        memo: z.string().optional().describe("Updated memo"),
        status: z
            .enum(["DRAFT", "PENDING", "SENT", "VOID"])
            .optional()
            .describe("Updated status (only certain transitions allowed)"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksInvoice(
        args.invoice_id,
        args.invoice
    );

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error updating invoice: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Invoice updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateInvoiceTool: ToolDefinition = {
    name: "update_invoice",
    description:
        "Update an existing invoice in KikoBooks. Only DRAFT invoices can be fully edited. For posted invoices, only status changes and memo updates are allowed.",
    schema: toolSchema,
    handler: toolHandler,
};
