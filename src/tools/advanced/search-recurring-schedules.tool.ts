import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    status: z.string().optional().describe("Filter by schedule status (e.g. Active / Paused)"),
    customerId: z.number().optional().describe("Filter by customer ID"),
    recurrenceType: z.string().optional().describe("Filter by recurrence type (e.g. Monthly / Weekly)"),
    dateFrom: z.string().optional().describe("Next-run date on/after (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("Next-run date on/before (YYYY-MM-DD)"),
    searchTerm: z.string().optional().describe("Search text"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortBy: z.string().optional().describe("Sort column"),
    sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/RecurringSchedules", {
            status: args.status,
            customer_id: args.customerId,
            recurrenceType: args.recurrenceType,
            dateFrom: args.dateFrom,
            dateTo: args.dateTo,
            searchTerm: args.searchTerm,
            page: args.page,
            pageSize: args.pageSize,
            sortBy: args.sortBy,
            sortDirection: args.sortDirection,
        });
        return { content: [{ type: "text" as const, text: "Recurring schedules:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching recurring schedules: ${formatError(e)}` }] };
    }
};

export const SearchRecurringSchedulesTool: ToolDefinition = {
    name: "search_recurring_schedules",
    description:
        "Search recurring invoice schedules (templates that auto-generate invoices on a cadence) with filters. Read-only.",
    schema,
    handler,
};
