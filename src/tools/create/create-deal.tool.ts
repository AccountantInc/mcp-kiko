import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksDeal } from "../../handlers/create-kikobooks-deal.handler.js";

const toolSchema = z.object({
    deal: z.object({
        leadId: z.number().describe("Originating lead ID (required)"),
        pipelineStageId: z.number().describe("Pipeline stage ID (required)"),
        dealName: z.string().describe("Deal name (required)"),
        proposalId: z.number().optional().describe("Linked proposal ID, if any"),
        customerId: z.number().optional().describe("Linked AR customer ID, if any"),
        dealValue: z.number().optional().describe("Deal value / amount"),
        currencyCode: z.string().optional().describe("Currency code (defaults to 'USD')"),
        dealStatus: z.string().optional().describe("Deal status (defaults to 'Open')"),
        expectedCloseDate: z.string().optional().describe("Expected close date (YYYY-MM-DD)"),
        notes: z.string().optional().describe("Free-text notes"),
        probability: z.number().optional().describe("Win probability percent"),
        tagIds: z.array(z.number()).optional().describe("Tag IDs to attach"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksDeal(args.deal);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating deal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deal created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateDealTool: ToolDefinition = {
    name: "create_deal",
    description:
        "Create a new CRM deal (sales opportunity) from a lead. Requires leadId, pipelineStageId, and dealName; " +
        "optionally include value, currency, status, expected close date, probability, and tags. " +
        "Requires the Sales module and the write scope. Confirm with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
