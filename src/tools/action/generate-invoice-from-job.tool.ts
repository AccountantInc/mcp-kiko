import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { generateKikoBooksInvoiceFromJob } from "../../handlers/generate-kikobooks-invoice-from-job.handler.js";

const toolSchema = z.object({
    job_id: z.number().describe("The job ID to invoice"),
    invoice_date: z.string().describe("Invoice date (YYYY-MM-DD) — required"),
    customer_id: z.number().optional().describe("Override customer ID for the invoice"),
    due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
    include_timesheets: z.boolean().optional().describe("Include approved timesheet lines (default: true)"),
    include_expenses: z.boolean().optional().describe("Include billable expenses (default: true)"),
    revenue_gl_account_id: z.number().optional().describe("Default revenue GL account ID for lines"),
    gl_ar_account_id: z.number().optional().describe("AR GL account ID for the invoice header"),
});

const toolHandler = async (args: any) => {
    const response = await generateKikoBooksInvoiceFromJob({
        jobId: args.job_id,
        invoiceDate: args.invoice_date,
        customerId: args.customer_id,
        dueDate: args.due_date,
        includeTimesheets: args.include_timesheets,
        includeExpenses: args.include_expenses,
        revenueGlAccountId: args.revenue_gl_account_id,
        glArAccountId: args.gl_ar_account_id,
    });

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error generating invoice from job: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Draft invoice generated from job:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GenerateInvoiceFromJobTool: ToolDefinition = {
    name: "generate_invoice_from_job",
    description:
        "Generate a DRAFT AR invoice from a job's approved timesheets and billable expenses — the Job → invoice bridge. " +
        "Creates a draft invoice (does not post to GL). Requires the Workflow module and the write scope. " +
        "Confirm the job and date with the user before calling, then verify the created invoice with get_invoice.",
    schema: toolSchema,
    handler: toolHandler,
};
