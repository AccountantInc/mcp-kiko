import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Get a single proposal with detail. Maps to GET /api/AC_SP_Proposal/{id}. */
export async function getKikoBooksProposal(proposalId: number): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get(`/api/AC_SP_Proposal/${proposalId}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
