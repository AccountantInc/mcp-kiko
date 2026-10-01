import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksLeads } from "../../handlers/search-kikobooks-leads.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by lead name, company, or email"),
    status: z.string().optional().describe("Filter by lead status"),
    leadSourceId: z.number().optional().describe("Filter by lead source ID"),
    tagId: z.number().optional().describe("Filter by tag ID"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksLeads(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching leads: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Leads:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchLeadsTool: ToolDefinition = {
    name: "search_leads",
    description:
        "Search CRM leads (prospective customers). Filter by status, lead source, tag, or text. " +
        "Requires the Sales module — call get_enabled_modules first for self-service (CB) orgs. " +
        "Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
