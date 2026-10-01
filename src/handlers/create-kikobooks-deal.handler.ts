import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Create a CRM deal. POST /api/Crm/deals with a SaveDealDto body. */
export async function createKikoBooksDeal(dealData: any): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post("/api/Crm/deals", dealData);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
