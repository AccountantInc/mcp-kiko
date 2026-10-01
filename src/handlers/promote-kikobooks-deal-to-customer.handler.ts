import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Promote a deal's customer to the "Customer" lifecycle stage and link it to
 * the deal. This is the hard-block gate that must run before creating proposals
 * or jobs from a deal. Maps to POST /api/Crm/deals/{dealId}/promote-to-customer.
 */
export async function promoteKikoBooksDealToCustomer(
    dealId: number
): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post(
            `/api/Crm/deals/${dealId}/promote-to-customer`
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
