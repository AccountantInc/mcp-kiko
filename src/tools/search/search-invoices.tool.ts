import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksInvoices } from "../../handlers/search-kikobooks-invoices.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by invoice number or customer name"),
    status: z
        .enum(["DRAFT", "PENDING", "SENT", "VIEWED", "PARTIAL", "PAID", "VOID", "WRITE_OFF"])
        .optional()
        .describe("Filter by invoice status"),
    customerId: z.number().optional().describe("Filter by customer ID"),
    dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
    overdue: z.boolean().optional().describe("Filter for overdue invoices only"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50, max: 500)"),
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
