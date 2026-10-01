import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Get a single CRM lead with detail. Maps to GET /api/Crm/leads/{id}. */
export async function getKikoBooksLead(leadId: number): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get(`/api/Crm/leads/${leadId}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
