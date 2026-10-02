import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Fixed asset ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/GL/FixedAssets/${args.id}`);
        return { content: [{ type: "text" as const, text: "Fixed asset:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting fixed asset: ${formatError(e)}` }] };
    }
};

export const GetFixedAssetTool: ToolDefinition = {
    name: "get_fixed_asset",
    description: "Get full details of a single fixed asset by ID, including depreciation settings. Read-only.",
    schema,
    handler,
};
