import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search AP bills. Maps to GET /api/Bills, which uses `searchTerm`, `fromDate`,
 * `toDate`, `overdueOnly` (not search/dateFrom/dateTo/overdue) — verified
 * against BillsController.
 */
export async function searchKikoBooksBills(params: {
    search?: string;
    status?: string;
    vendorId?: number;
    dateFrom?: string;
    dateTo?: string;
    overdue?: boolean;
    unpaidOnly?: boolean;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Bills", {
            searchTerm: params.search,
            status: params.status,
            vendorId: params.vendorId,
            fromDate: params.dateFrom,
            toDate: params.dateTo,
            overdueOnly: params.overdue,
            unpaidOnly: params.unpaidOnly,
            page: params.page,
            pageSize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
