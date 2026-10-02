import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    bankAccountId: z.number().optional().describe("Filter to a single bank account ID"),
    search: z.string().optional().describe("Search by description/counterparty text"),
    direction: z.string().optional().describe("Filter by direction (e.g. Debit / Credit / Inflow / Outflow)"),
    matchStatus: z.string().optional().describe("Filter by match status (e.g. Matched / Unmatched)"),
    dateFrom: z.string().optional().describe("Value date on/after (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Value date on/before (YYYY-MM-DD)"),
    duplicatesOnly: z.boolean().optional().describe("Only transactions flagged as duplicates"),
    excludedOnly: z.boolean().optional().describe("Only excluded transactions"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortBy: z.string().optional().describe("Sort column (default: ValueDate)"),
    sortDesc: z.boolean().optional().describe("Sort descending (default: true)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/v2/bank/transactions", {
            bankAccountId: args.bankAccountId,
            search: args.search,
            direction: args.direction,
            matchStatus: args.matchStatus,
            dateFrom: args.dateFrom,
            dateTo: args.dateTo,
            duplicatesOnly: args.duplicatesOnly,
            excludedOnly: args.excludedOnly,
            page: args.page,
            pageSize: args.pageSize,
            sortBy: args.sortBy,
            sortDesc: args.sortDesc,
        });
        return { content: [{ type: "text" as const, text: "Bank transactions:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching bank transactions: ${formatError(e)}` }] };
    }
};

export const SearchBankTransactionsTool: ToolDefinition = {
    name: "search_bank_transactions",
    description:
        "Search imported bank transactions with filters (account, date range, direction, match status, duplicates). Read-only — this is append-only bank evidence.",
    schema,
    handler,
};
