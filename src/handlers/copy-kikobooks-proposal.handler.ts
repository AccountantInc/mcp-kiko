import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Duplicate a proposal. POST /api/AC_SP_Proposal/CopyProposal/{proposalId}. */
export async function copyKikoBooksProposal(proposalId: number): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post(`/api/AC_SP_Proposal/CopyProposal/${proposalId}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
