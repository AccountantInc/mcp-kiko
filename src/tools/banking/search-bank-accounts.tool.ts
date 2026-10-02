import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    search: z.string().optional().describe("Search by bank account display name"),
    status: z.string().optional().describe("Filter by status"),
    accountType: z.string().optional().describe("Filter by account type"),
    unmappedOnly: z.boolean().optional().describe("Only accounts not yet mapped to a GL account"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortBy: z.string().optional().describe("Sort column (default: AccountDisplayName)"),
    sortDesc: z.boolean().optional().describe("Sort descending (default: false)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/v2/bank/accounts", {
            search: args.search,
            status: args.status,
            accountType: args.accountType,
            unmappedOnly: args.unmappedOnly,
            page: args.page,
            pageSize: args.pageSize,
            sortBy: args.sortBy,
            sortDesc: args.sortDesc,
        });
        return { content: [{ type: "text" as const, text: "Bank accounts:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching bank accounts: ${formatError(e)}` }] };
    }
};

export const SearchBankAccountsTool: ToolDefinition = {
    name: "search_bank_accounts",
    description:
        "Search the organization's bank accounts (connected/manual) with paging and filters. Read-only.",
    schema,
    handler,
};
