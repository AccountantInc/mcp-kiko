import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksVendors } from "../../handlers/search-kikobooks-vendors.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by vendor name or company"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50, max: 500)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksVendors(args);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error searching vendors: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Vendors:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchVendorsTool: ToolDefinition = {
    name: "search_vendors",
    description: "Search vendors in KikoBooks. Supports text search by name or company. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
