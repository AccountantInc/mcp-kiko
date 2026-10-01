import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Get the CRM pipeline with stages and per-stage deal counts — the "where are
 * my deals?" overview. Maps to GET /api/Crm/pipeline. An optional pipelineId
 * narrows to one pipeline when the org has several.
 */
export async function getKikoBooksPipeline(params: {
    pipelineId?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Crm/pipeline", {
            pipelineId: params.pipelineId,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
