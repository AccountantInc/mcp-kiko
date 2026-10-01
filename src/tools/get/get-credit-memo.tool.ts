import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksCreditMemo } from "../../handlers/get-kikobooks-credit-memo.handler.js";

const toolSchema = z.object({
    credit_memo_id: z.number().describe("The credit memo ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksCreditMemo(args.credit_memo_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error getting credit memo: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Credit Memo details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetCreditMemoTool: ToolDefinition = {
    name: "get_credit_memo",
    description:
        "Get a credit memo by ID from KikoBooks. Returns full credit memo details including line items and application history.",
    schema: toolSchema,
    handler: toolHandler,
};
