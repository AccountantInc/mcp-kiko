import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksDeal } from "../../handlers/update-kikobooks-deal.handler.js";

const toolSchema = z.object({
    deal_id: z.number().describe("The CRM deal ID to update"),
    deal: z.object({
        leadId: z.number().describe("Originating lead ID (required)"),
        pipelineStageId: z.number().describe("Pipeline stage ID (required)"),
        dealName: z.string().describe("Deal name (required)"),
        proposalId: z.number().optional().describe("Linked proposal ID, if any"),
        customerId: z.number().optional().describe("Linked AR customer ID, if any"),
        dealValue: z.number().optional().describe("Deal value / amount"),
        currencyCode: z.string().optional().describe("Currency code"),
        dealStatus: z.string().optional().describe("Deal status (e.g. Open, Won, Lost)"),
        expectedCloseDate: z.string().optional().describe("Expected close date (YYYY-MM-DD)"),
        notes: z.string().optional().describe("Free-text notes"),
        probability: z.number().optional().describe("Win probability percent"),
        tagIds: z.array(z.number()).optional().describe("Tag IDs to attach"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksDeal(args.deal_id, args.deal);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error updating deal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deal updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateDealTool: ToolDefinition = {
    name: "update_deal",
    description:
        "Update an existing CRM deal. Supply the deal_id and the full deal object (leadId, pipelineStageId, " +
        "and dealName are required). Use this to change value, status, close date, or probability. " +
        "Requires the Sales module and the write scope. Read the current deal first (get_deal), then confirm changes.",
    schema: toolSchema,
    handler: toolHandler,
};
