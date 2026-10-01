import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search CRM leads. Maps to GET /api/Crm/leads (camelCase query params) —
 * verified against CrmController. Requires the Sales module to be enabled for
 * the org (CA always; CB opt-in — check get_enabled_modules first).
 */
export async function searchKikoBooksLeads(params: {
    search?: string;
    status?: string;
    leadSourceId?: number;
    tagId?: number;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Crm/leads", {
            search: params.search,
            status: params.status,
            leadSourceId: params.leadSourceId,
            tagId: params.tagId,
            page: params.page,
            pageSize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
