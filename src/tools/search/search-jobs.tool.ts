import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksJobs } from "../../handlers/search-kikobooks-jobs.handler.js";

const toolSchema = z.object({
    customerId: z.string().optional().describe("Filter by customer ID"),
    status: z.string().optional().describe("Filter by job status"),
    name: z.string().optional().describe("Filter by job name"),
    tags: z.string().optional().describe("Filter by tags"),
    filterType: z.string().optional().describe("Filter type"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 15)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksJobs(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching jobs: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Jobs:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchJobsTool: ToolDefinition = {
    name: "search_jobs",
    description:
        "Search jobs (shown as 'Projects' for self-service businesses, 'Engagements' for accounting firms). " +
        "Filter by customer, status, name, or tags. Requires the Workflow module — call get_enabled_modules " +
        "first for CB orgs. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
