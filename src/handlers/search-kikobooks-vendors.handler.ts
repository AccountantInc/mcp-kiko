import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search AP vendors. Maps to GET /api/Vendors, which uses `searchTerm`,
 * `activeFlag`, `openBalance`, `pageindex`, `pagesize` (not the common
 * page/pageSize) — verified against VendorsController.
 */
export async function searchKikoBooksVendors(params: {
    search?: string;
    activeFilter?: string;
    openBalance?: string;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Vendors", {
            searchTerm: params.search,
            activeFlag: params.activeFilter,
            openBalance: params.openBalance,
            pageindex: params.page,
            pagesize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
