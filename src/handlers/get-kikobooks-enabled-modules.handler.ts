import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Reports which modules/capabilities the connected organization has enabled.
 *
 * Bookkeeping + AI are always on. CRM, Proposals ("Sales"), and Workflow are
 * mandatory for accounting-firm (CA) orgs but opt-in per-org for self-service
 * (CB) orgs, so an agent must check this before offering sales/workflow actions.
 * Grounded on GET /api/AuthorizationBackbone/runtime.
 */
export async function getKikoBooksEnabledModules(): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/AuthorizationBackbone/runtime");
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
