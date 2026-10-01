import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Get a single job (Project/Engagement) with detail. GET /api/AC_SP_Jobs/{id}. */
export async function getKikoBooksJob(jobId: number): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get(`/api/AC_SP_Jobs/${jobId}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
