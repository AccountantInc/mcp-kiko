import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksLead } from "../../handlers/get-kikobooks-lead.handler.js";

const toolSchema = z.object({
    lead_id: z.number().describe("The CRM lead ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksLead(args.lead_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting lead: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Lead details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetLeadTool: ToolDefinition = {
    name: "get_lead",
    description:
        "Get a single CRM lead by ID with full detail (contact info, status, source, linked customer). " +
        "Requires the Sales module.",
    schema: toolSchema,
    handler: toolHandler,
};
