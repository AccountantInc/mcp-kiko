import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksJobStatus } from "../../handlers/update-kikobooks-job-status.handler.js";

const toolSchema = z.object({
    job_id: z.number().describe("The job (Project/Engagement) ID to update"),
    status: z.string().describe("The new job status"),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksJobStatus(args.job_id, args.status);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error updating job status: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Job status updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateJobStatusTool: ToolDefinition = {
    name: "update_job_status",
    description:
        "Update a job's (Project/Engagement) status. Requires the Workflow module and the write scope. " +
        "Read the current job first (get_job) and confirm the new status with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
