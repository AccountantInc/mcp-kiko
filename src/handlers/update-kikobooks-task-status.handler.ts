import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Update a task's status. PUT /api/AC_SP_Job_Tasks/status/{taskId}?status=&SubDomain=.
 * `SubDomain` is a real query param on the endpoint; it is passed through only
 * when supplied (the backend returns a clear error if it is required).
 */
export async function updateKikoBooksTaskStatus(
    taskId: number,
    status: string,
    subDomain?: string
): Promise<ToolResponse<any>> {
    try {
        const params = new URLSearchParams({ status });
        if (subDomain) params.set("SubDomain", subDomain);
        const response = await kikoBooksClient.put(
            `/api/AC_SP_Job_Tasks/status/${taskId}?${params.toString()}`
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
