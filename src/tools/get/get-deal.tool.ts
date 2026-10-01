import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksDeal } from "../../handlers/get-kikobooks-deal.handler.js";

const toolSchema = z.object({
    deal_id: z.number().describe("The CRM deal ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksDeal(args.deal_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting deal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deal details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetDealTool: ToolDefinition = {
    name: "get_deal",
    description:
        "Get a single CRM deal by ID with full detail (value, stage, pipeline, linked lead/customer). " +
        "Requires the Sales module.",
    schema: toolSchema,
    handler: toolHandler,
};
