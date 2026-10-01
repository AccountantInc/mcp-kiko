import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Update an existing CRM deal. PUT /api/Crm/deals/{id} with a SaveDealDto body. */
export async function updateKikoBooksDeal(dealId: number, dealData: any): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.put(`/api/Crm/deals/${dealId}`, dealData);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
