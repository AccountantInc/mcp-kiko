import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { moveKikoBooksDealStage } from "../../handlers/move-kikobooks-deal-stage.handler.js";

const toolSchema = z.object({
    deal_id: z.number().describe("The CRM deal ID to move"),
    target_stage_id: z.number().describe("The pipeline stage ID to move the deal into"),
});

const toolHandler = async (args: any) => {
    const response = await moveKikoBooksDealStage(args.deal_id, args.target_stage_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error moving deal stage: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deal moved to new stage:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const MoveDealStageTool: ToolDefinition = {
    name: "move_deal_stage",
    description:
        "Move a CRM deal to a different pipeline stage (advance or regress it on the board). " +
        "Requires the Sales module and the write scope. Preview the target stage and confirm before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
