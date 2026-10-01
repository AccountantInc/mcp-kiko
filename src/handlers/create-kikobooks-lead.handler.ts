import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Create a CRM lead. POST /api/Crm/leads with a SaveLeadDto body. */
export async function createKikoBooksLead(leadData: any): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post("/api/Crm/leads", leadData);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
