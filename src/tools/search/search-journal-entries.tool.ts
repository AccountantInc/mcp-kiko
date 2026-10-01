import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksJournalEntries } from "../../handlers/search-kikobooks-journal-entries.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by entry number or description"),
    dateFrom: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    dateTo: z.string().optional().describe("End date (YYYY-MM-DD)"),
    source: z
        .enum(["MANUAL", "AR_INVOICE", "AR_PAYMENT", "AP_BILL", "AP_PAYMENT", "BANK"])
        .optional()
        .describe("Filter by journal entry source"),
    posted: z.boolean().optional().describe("Filter by posted status"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50, max: 500)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksJournalEntries(args);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error searching journal entries: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Journal Entries:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchJournalEntriesTool: ToolDefinition = {
    name: "search_journal_entries",
    description:
        "List journal entries from KikoBooks general ledger. Filter by date range, source (MANUAL, AR_INVOICE, AP_BILL, etc.), and posted status. Posted entries are immutable.",
    schema: toolSchema,
    handler: toolHandler,
};
