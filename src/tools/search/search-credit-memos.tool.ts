import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksCreditMemos } from "../../handlers/search-kikobooks-credit-memos.handler.js";

const toolSchema = z.object({
    customer_id: z.number().optional().describe("Filter by customer ID"),
    status: z.string().optional().describe("Filter by status (e.g., 'Draft', 'Posted', 'Applied', 'Voided')"),
    reasonCode: z.string().optional().describe("Filter by reason code"),
    fromDate: z.string().optional().describe("Filter from this date (YYYY-MM-DD)"),
    toDate: z.string().optional().describe("Filter to this date (YYYY-MM-DD)"),
    minAmount: z.number().optional().describe("Minimum credit memo amount"),
    maxAmount: z.number().optional().describe("Maximum credit memo amount"),
    hasRemainingBalance: z.boolean().optional().describe("Filter to only credit memos with unapplied balance"),
    invoiceId: z.number().optional().describe("Filter by related invoice ID"),
    search: z.string().optional().describe("Search by credit memo number or description"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Number of results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksCreditMemos(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching credit memos: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Credit Memos:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchCreditMemosTool: ToolDefinition = {
    name: "search_credit_memos",
    description:
        "List credit memos (AR) from KikoBooks. Supports filtering by customer, status, reason, date range, amount range, and remaining balance. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
