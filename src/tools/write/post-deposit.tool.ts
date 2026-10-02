import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Deposit ID to post"),
    postingDate: z.string().optional().describe("GL posting date (YYYY-MM-DD). Default: deposit date"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/Deposits/${args.id}/post`, { postingDate: args.postingDate });
        return { content: [{ type: "text" as const, text: "Deposit posted:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error posting deposit: ${formatError(e)}` }] };
    }
};

export const PostDepositTool: ToolDefinition = {
    name: "post_deposit",
    description: "Post a DRAFT deposit to the General Ledger (DR Bank, CR Undeposited Funds). Irreversible except by void. Confirm with the user first.",
    schema,
    handler,
};
