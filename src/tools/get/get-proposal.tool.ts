import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksProposal } from "../../handlers/get-kikobooks-proposal.handler.js";

const toolSchema = z.object({
    proposal_id: z.number().describe("The proposal ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksProposal(args.proposal_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting proposal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Proposal details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetProposalTool: ToolDefinition = {
    name: "get_proposal",
    description:
        "Get a single proposal by ID with full detail (status, pricing options, line items, signatures). " +
        "Requires the Sales module.",
    schema: toolSchema,
    handler: toolHandler,
};
