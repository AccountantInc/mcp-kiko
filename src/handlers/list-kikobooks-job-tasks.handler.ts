import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * List the tasks for a specific job. Maps to
 * GET /api/AC_SP_Job_Tasks/JobTasksByJob/{jobId} (params `Status`, `name`,
 * `pageindex`, `pagesize`) — verified against AC_SP_Job_TasksController.
 */
export async function listKikoBooksJobTasks(
    jobId: number,
    params: { status?: string; name?: string; page?: number; pageSize?: number }
): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get(
            `/api/AC_SP_Job_Tasks/JobTasksByJob/${jobId}`,
            {
                Status: params.status,
                name: params.name,
                pageindex: params.page,
                pagesize: params.pageSize,
            }
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
