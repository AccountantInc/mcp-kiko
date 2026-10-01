import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksSalesReceipts } from "../../handlers/search-kikobooks-sales-receipts.handler.js";

const toolSchema = z.object({
    customer_id: z.number().optional().describe("Filter by customer ID"),
    status: z.string().optional().describe("Filter by status (e.g., 'Draft', 'Posted')"),
    paymentMethodCode: z.string().optional().describe("Filter by payment method code"),
    dateFrom: z.string().optional().describe("Filter from this date (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Filter to this date (YYYY-MM-DD)"),
    searchTerm: z.string().optional().describe("Search by receipt number or description"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Number of results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksSalesReceipts(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching sales receipts: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Sales Receipts:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchSalesReceiptsTool: ToolDefinition = {
    name: "search_sales_receipts",
    description:
        "List sales receipts from KikoBooks. Sales receipts record instant payments (no invoice needed). Supports filtering by customer, status, payment method, and date range.",
    schema: toolSchema,
    handler: toolHandler,
};
