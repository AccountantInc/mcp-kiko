import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    search: z.string().optional().describe("Search by asset name/tag"),
    categoryCode: z.string().optional().describe("Filter by asset category code"),
    status: z.string().optional().describe("Filter by status (e.g. Active / Disposed)"),
    depreciationMethodCode: z.string().optional().describe("Filter by depreciation method code"),
    location: z.string().optional().describe("Filter by location"),
    department: z.string().optional().describe("Filter by department"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Results per page (default: 50)"),
    sortColumn: z.string().optional().describe("Sort column (default: AcquisitionDate)"),
    sortDirection: z.enum(["ASC", "DESC"]).optional().describe("Sort direction (default: DESC)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/GL/FixedAssets", {
            search: args.search,
            categoryCode: args.categoryCode,
            status: args.status,
            depreciationMethodCode: args.depreciationMethodCode,
            location: args.location,
            department: args.department,
            page: args.page,
            pageSize: args.pageSize,
            sortColumn: args.sortColumn,
            sortDirection: args.sortDirection,
        });
        return { content: [{ type: "text" as const, text: "Fixed assets:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error searching fixed assets: ${formatError(e)}` }] };
    }
};

export const SearchFixedAssetsTool: ToolDefinition = {
    name: "search_fixed_assets",
    description:
        "Search fixed assets (capitalized property/equipment) with filters by category, status, depreciation method, location, or department. Read-only.",
    schema,
    handler,
};
