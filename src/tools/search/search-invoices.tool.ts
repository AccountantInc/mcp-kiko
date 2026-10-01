import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksInvoices } from "../../handlers/search-kikobooks-invoices.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by invoice number or customer name"),
    status: z
        .enum(["DRAFT", "PENDING", "SENT", "VIEWED", "PARTIAL", "PAID", "VOID", "WRITE_OFF"])
        .optional()
        .describe("Filter by invoice status"),
    customerId: z.number().optional().describe("Filter by customer ID (AR_Customer_Id)"),
    invoiceDateFrom: z.string().optional().describe("Invoice date on/after (YYYY-MM-DD)"),
    invoiceDateTo: z.string().optional().describe("Invoice date on/before (YYYY-MM-DD)"),
    dueDateFrom: z.string().optional().describe("Due date on/after (YYYY-MM-DD)"),
    dueDateTo: z.string().optional().describe("Due date on/before (YYYY-MM-DD)"),
    isOverdue: z.boolean().optional().describe("Only invoices past their due date"),
    hasBalance: z.boolean().optional().describe("Only invoices with an outstanding balance"),
    termsCode: z.string().optional().describe("Filter by payment terms code"),
    currencyCode: z.string().optional().describe("Filter by ISO currency code"),
    isPosted: z.boolean().optional().describe("Filter by GL posting state"),
    srcProvider: z.string().optional().describe("Filter by source provider (e.g. Stripe, BILL)"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortColumn: z.string().optional().describe("Sort column (default: AR_Invoice_Id)"),
    sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction (default: DESC)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksInvoices(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching invoices: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Invoices:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchInvoicesTool: ToolDefinition = {
    name: "search_invoices",
    description:
        "Search invoices in KikoBooks. Filter by status (DRAFT, PENDING, SENT, PAID, etc.), customer, date range, or overdue status. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
