import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksBills } from "../../handlers/search-kikobooks-bills.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by bill number or vendor name"),
    status: z
        .enum(["DRAFT", "PENDING", "APPROVED", "POSTED", "PAID", "VOIDED"])
        .optional()
        .describe("Filter by bill status"),
    vendorId: z.number().optional().describe("Filter by vendor ID"),
    dateFrom: z.string().optional().describe("Start date filter (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("End date filter (YYYY-MM-DD)"),
    overdue: z.boolean().optional().describe("Filter for overdue bills only"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50, max: 500)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksBills(args);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error searching bills: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Bills:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchBillsTool: ToolDefinition = {
    name: "search_bills",
    description:
        "List bills (accounts payable) from KikoBooks. Filter by status, vendor, date range, or overdue status. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
