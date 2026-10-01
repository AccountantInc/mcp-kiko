import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksItems } from "../../handlers/search-kikobooks-items.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by item name or description"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50, max: 500)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksItems(args);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error searching items: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Items:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchItemsTool: ToolDefinition = {
    name: "search_items",
    description: "List products/services (items) from KikoBooks. Returns paginated results with search support.",
    schema: toolSchema,
    handler: toolHandler,
};
