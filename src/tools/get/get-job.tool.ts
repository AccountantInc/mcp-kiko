import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksJob } from "../../handlers/get-kikobooks-job.handler.js";

const toolSchema = z.object({
    job_id: z.number().describe("The job (Project/Engagement) ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksJob(args.job_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting job: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Job details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetJobTool: ToolDefinition = {
    name: "get_job",
    description:
        "Get a single job (Project/Engagement) by ID with full detail (status, customer, dates, billing). " +
        "Requires the Workflow module.",
    schema: toolSchema,
    handler: toolHandler,
};
