import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search proposals. Maps to GET /api/AC_SP_Proposal/MyProposals, which uses
 * `pageindex`/`pagesize` (not page/pageSize) and a string `customerId` —
 * verified against AC_SP_ProposalController. Requires the Sales module.
 */
export async function searchKikoBooksProposals(params: {
    customerId?: string;
    status?: string;
    name?: string;
    source?: string;
    fromDate?: string;
    toDate?: string;
    orderBy?: string;
    page?: number;
    pageSize?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/AC_SP_Proposal/MyProposals", {
            customerId: params.customerId,
            status: params.status,
            name: params.name,
            source: params.source,
            fromDate: params.fromDate,
            toDate: params.toDate,
            orderBy: params.orderBy,
            pageindex: params.page,
            pagesize: params.pageSize,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
