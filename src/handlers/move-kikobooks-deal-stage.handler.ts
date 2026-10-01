import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Move a CRM deal to a different pipeline stage (the drag-drop on the board).
 * Maps to POST /api/Crm/deals/{dealId}/move-stage with body { targetStageId }.
 */
export async function moveKikoBooksDealStage(
    dealId: number,
    targetStageId: number
): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post(
            `/api/Crm/deals/${dealId}/move-stage`,
            { targetStageId }
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
