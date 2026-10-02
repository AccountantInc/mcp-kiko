import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    statementType: z.string().optional().describe("Filter by statement type"),
    customerId: z.number().optional().describe("Filter by customer ID"),
    deliveryStatus: z.string().optional().describe("Filter by delivery status (e.g. Draft / Sent)"),
    dateFrom: z.string().optional().describe("Statement date on/after (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Statement date on/before (YYYY-MM-DD)"),
    searchTerm: z.string().optional().describe("Search text"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortBy: z.string().optional().describe("Sort column"),
    sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/Statements", {
            statementType: args.statementType,
            customer_id: args.customerId,
            deliveryStatus: args.deliveryStatus,
            dateFrom: args.dateFrom,
            dateTo: args.dateTo,
            searchTerm: args.searchTerm,
            page: args.page,
            pageSize: args.pageSize,
            sortBy: args.sortBy,
            sortDirection: args.sortDirection,
        });
        return { content: [{ type: "text" as const, text: "Customer statements:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching statements: ${formatError(e)}` }] };
    }
};

export const SearchStatementsTool: ToolDefinition = {
    name: "search_statements",
    description:
        "Search customer statements (periodic AR statements sent to customers) with filters. Read-only.",
    schema,
    handler,
};
