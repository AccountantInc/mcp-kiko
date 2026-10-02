import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    status: z.string().optional().describe("Filter by deposit status"),
    bankAccountId: z.number().optional().describe("Filter by destination bank account ID"),
    dateFrom: z.string().optional().describe("Deposit date on/after (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Deposit date on/before (YYYY-MM-DD)"),
    reconciled: z.boolean().optional().describe("Filter by reconciled state"),
    searchTerm: z.string().optional().describe("Search text"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortBy: z.string().optional().describe("Sort column (default: DepositDate)"),
    sortDescending: z.boolean().optional().describe("Sort descending (default: true)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/Deposits", {
            status: args.status,
            bankAccountId: args.bankAccountId,
            dateFrom: args.dateFrom,
            dateTo: args.dateTo,
            reconciled: args.reconciled,
            searchTerm: args.searchTerm,
            page: args.page,
            pageSize: args.pageSize,
            sortBy: args.sortBy,
            sortDescending: args.sortDescending,
        });
        return { content: [{ type: "text" as const, text: "Deposits:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching deposits: ${formatError(e)}` }] };
    }
};

export const SearchDepositsTool: ToolDefinition = {
    name: "search_deposits",
    description:
        "Search bank deposits (grouped undeposited payments moved to a bank account) with filters. Read-only.",
    schema,
    handler,
};
