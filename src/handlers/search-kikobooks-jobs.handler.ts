import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search jobs (labelled "Projects" for CB, "Engagements" for CA). Maps to
 * GET /api/AC_SP_Jobs/CurrOrgJobs, which uses `pageindex`/`pagesize` and a
 * string `customerId` — verified against AC_SP_JobsController. Requires the
 * Workflow module.
 */
export async function searchKikoBooksJobs(params: {
    customerId?: string;
    status?: string;
    name?: string;
    tags?: string;
    filterType?: string;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/AC_SP_Jobs/CurrOrgJobs", {
            customerId: params.customerId,
            status: params.status,
            name: params.name,
            tags: params.tags,
            filterType: params.filterType,
            pageindex: params.page,
            pagesize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
