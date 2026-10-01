import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Generate a DRAFT AR invoice from a signed/contracted proposal — the
 * Proposal → AR bridge. Maps the selected pricing option's line items to the
 * invoice. POST /api/AC_SP_Proposal/{id}/generate-invoice. All body fields are
 * optional; the backend applies sensible defaults.
 */
export async function generateKikoBooksInvoiceFromProposal(
    proposalId: number,
    body: {
        invoiceDate?: string;
        dueDate?: string;
        termsCode?: string;
        glArAccountId?: number;
        defaultRevenueGlAccountId?: number;
    }
): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post(
            `/api/AC_SP_Proposal/${proposalId}/generate-invoice`,
            {
                InvoiceDate: body.invoiceDate,
                DueDate: body.dueDate,
                TermsCode: body.termsCode,
                GLARAccountId: body.glArAccountId,
                DefaultRevenueGLAccountId: body.defaultRevenueGlAccountId,
            }
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
