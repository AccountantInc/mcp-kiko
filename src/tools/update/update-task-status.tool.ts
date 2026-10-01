import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksTaskStatus } from "../../handlers/update-kikobooks-task-status.handler.js";

const toolSchema = z.object({
    task_id: z.number().describe("The task ID to update"),
    status: z.string().describe("The new task status (e.g. Open, In Progress, Completed)"),
    sub_domain: z
        .string()
        .optional()
        .describe("Optional SubDomain context the endpoint accepts; supply only if a prior call reports it is required"),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksTaskStatus(args.task_id, args.status, args.sub_domain);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error updating task status: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Task status updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateTaskStatusTool: ToolDefinition = {
    name: "update_task_status",
    description:
        "Update a job task's status (e.g. mark a task complete). Requires the Workflow module and the write scope. " +
        "List tasks first (list_job_tasks) and confirm the new status with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
