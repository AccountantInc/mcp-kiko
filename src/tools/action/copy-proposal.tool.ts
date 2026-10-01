import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { copyKikoBooksProposal } from "../../handlers/copy-kikobooks-proposal.handler.js";

const toolSchema = z.object({
    proposal_id: z.number().describe("The proposal ID to duplicate"),
});

const toolHandler = async (args: any) => {
    const response = await copyKikoBooksProposal(args.proposal_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error copying proposal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Proposal copied:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CopyProposalTool: ToolDefinition = {
    name: "copy_proposal",
    description:
        "Duplicate an existing proposal into a new draft. Requires the Sales module and the write scope. " +
        "Confirm with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
