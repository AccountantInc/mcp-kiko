import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search GL journal entries. Maps to GET /api/GeneralLedger/journal-entries,
 * which uses `startDate`, `endDate`, `postedOnly` (not dateFrom/dateTo/posted)
 * — verified against GeneralLedgerController.
 */
export async function searchKikoBooksJournalEntries(params: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    source?: string;
    posted?: boolean;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/GeneralLedger/journal-entries", {
            search: params.search,
            startDate: params.dateFrom,
            endDate: params.dateTo,
            source: params.source,
            postedOnly: params.posted,
            page: params.page,
            pageSize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
