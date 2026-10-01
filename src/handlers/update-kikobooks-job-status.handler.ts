import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/** Update a job's status. PUT /api/AC_SP_Jobs/status/{id}?status=<status>. */
export async function updateKikoBooksJobStatus(
    jobId: number,
    status: string
): Promise<ToolResponse<any>> {
    try {
        const qs = new URLSearchParams({ status }).toString();
        const response = await kikoBooksClient.put(`/api/AC_SP_Jobs/status/${jobId}?${qs}`);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
