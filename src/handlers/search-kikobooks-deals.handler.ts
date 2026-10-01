import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search CRM deals. Maps to GET /api/Crm/deals (camelCase query params) —
 * verified against CrmController. Requires the Sales module to be enabled.
 */
export async function searchKikoBooksDeals(params: {
    search?: string;
    status?: string;
    pipelineId?: number;
    stageId?: number;
    leadId?: number;
    tagId?: number;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Crm/deals", {
            search: params.search,
            status: params.status,
            pipelineId: params.pipelineId,
            stageId: params.stageId,
            leadId: params.leadId,
            tagId: params.tagId,
            page: params.page,
            pageSize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
