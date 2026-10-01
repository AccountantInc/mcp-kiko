import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksProposals } from "../../handlers/search-kikobooks-proposals.handler.js";

const toolSchema = z.object({
    customerId: z.string().optional().describe("Filter by customer ID"),
    status: z.string().optional().describe("Filter by proposal status (draft, sent, signed, declined, etc.)"),
    name: z.string().optional().describe("Filter by proposal name"),
    source: z.string().optional().describe("Filter by source"),
    fromDate: z.string().optional().describe("Created on/after (YYYY-MM-DD)"),
    toDate: z.string().optional().describe("Created on/before (YYYY-MM-DD)"),
    orderBy: z.string().optional().describe("Sort column"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 15)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksProposals(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching proposals: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Proposals:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchProposalsTool: ToolDefinition = {
    name: "search_proposals",
    description:
        "Search proposals in KikoBooks. Filter by customer, status (draft, sent, signed, declined), " +
        "name, source, or date range. Requires the Sales module — call get_enabled_modules first for CB orgs. " +
        "Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
