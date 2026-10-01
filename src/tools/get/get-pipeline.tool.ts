import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksPipeline } from "../../handlers/get-kikobooks-pipeline.handler.js";

const toolSchema = z.object({
    pipeline_id: z
        .number()
        .optional()
        .describe("Optional pipeline ID to narrow to one pipeline when the org has several"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksPipeline({ pipelineId: args.pipeline_id });

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting pipeline: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Pipeline (stages and deal counts):" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetPipelineTool: ToolDefinition = {
    name: "get_pipeline",
    description:
        "Get the CRM sales pipeline with its stages and per-stage deal counts — the 'where are my deals' " +
        "overview. Optionally narrow to one pipeline by ID. Requires the Sales module.",
    schema: toolSchema,
    handler: toolHandler,
};
