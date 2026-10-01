import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Get a single CRM deal with detail. Maps to GET /api/Crm/deals/{id}. */
export async function getKikoBooksDeal(dealId: number): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get(`/api/Crm/deals/${dealId}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
