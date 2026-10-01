import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Generate a DRAFT AR invoice from a job's approved timesheets + billable
 * expenses — the Job → AR bridge. POST /api/AC_SP_Jobs/GenerateInvoice.
 * Org_Id and UserId are injected server-side from the token, so they are never
 * sent here. SP_Job_Id and InvoiceDate are required by the command.
 */
export async function generateKikoBooksInvoiceFromJob(body: {
    jobId: number;
    invoiceDate: string;
    customerId?: number;
    dueDate?: string;
    includeTimesheets?: boolean;
    includeExpenses?: boolean;
    revenueGlAccountId?: number;
    glArAccountId?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post("/api/AC_SP_Jobs/GenerateInvoice", {
            SP_Job_Id: body.jobId,
            InvoiceDate: body.invoiceDate,
            Customer_Id: body.customerId,
            DueDate: body.dueDate,
            IncludeTimesheets: body.includeTimesheets,
            IncludeExpenses: body.includeExpenses,
            RevenueGL_Account_Id: body.revenueGlAccountId,
            GL_ARAccount_Id: body.glArAccountId,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
