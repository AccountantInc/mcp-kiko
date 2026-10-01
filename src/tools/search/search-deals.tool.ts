import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksDeals } from "../../handlers/search-kikobooks-deals.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by deal name or associated customer"),
    status: z.string().optional().describe("Filter by deal status (e.g. open, won, lost)"),
    pipelineId: z.number().optional().describe("Filter by pipeline ID"),
    stageId: z.number().optional().describe("Filter by pipeline stage ID"),
    leadId: z.number().optional().describe("Filter by originating lead ID"),
    tagId: z.number().optional().describe("Filter by tag ID"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksDeals(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching deals: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deals:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchDealsTool: ToolDefinition = {
    name: "search_deals",
    description:
        "Search CRM deals (sales opportunities) in the pipeline. Filter by status, pipeline, stage, " +
        "lead, tag, or text. Requires the Sales module — call get_enabled_modules first for CB orgs. " +
        "Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
