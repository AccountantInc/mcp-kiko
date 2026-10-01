import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksPurchases } from "../../handlers/search-kikobooks-purchases.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by vendor name, memo, or reference"),
    vendorId: z.number().optional().describe("Filter by vendor ID"),
    status: z.string().optional().describe("Filter by status (e.g., DRAFT, POSTED, VOIDED)"),
    dateFrom: z.string().optional().describe("Filter from date (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Filter to date (YYYY-MM-DD)"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortColumn: z.string().optional().describe("Column to sort by"),
    sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksPurchases(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching purchases: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Purchases:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchPurchasesTool: ToolDefinition = {
    name: "search_purchases",
    description:
        "Search purchases (expenses) in KikoBooks. Supports filtering by vendor, status, date range, and text search.",
    schema: toolSchema,
    handler: toolHandler,
};
