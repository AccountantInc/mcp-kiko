import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { listKikoBooksJobTasks } from "../../handlers/list-kikobooks-job-tasks.handler.js";

const toolSchema = z.object({
    job_id: z.number().describe("The job ID whose tasks to list"),
    status: z.string().optional().describe("Filter by task status"),
    name: z.string().optional().describe("Filter by task name"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 15)"),
});

const toolHandler = async (args: any) => {
    const response = await listKikoBooksJobTasks(args.job_id, {
        status: args.status,
        name: args.name,
        page: args.page,
        pageSize: args.pageSize,
    });

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error listing job tasks: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Job tasks:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const ListJobTasksTool: ToolDefinition = {
    name: "list_job_tasks",
    description:
        "List the tasks for a specific job (Project/Engagement). Filter by status or name. " +
        "Requires the Workflow module.",
    schema: toolSchema,
    handler: toolHandler,
};
