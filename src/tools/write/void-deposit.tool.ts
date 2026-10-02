import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Deposit ID to void"),
    voidReason: z.string().optional().describe("Reason for voiding"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/Deposits/${args.id}/void`, { voidReason: args.voidReason });
        return { content: [{ type: "text" as const, text: "Deposit voided:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error voiding deposit: ${formatError(e)}` }] };
    }
};

export const VoidDepositTool: ToolDefinition = {
    name: "void_deposit",
    description: "Void a deposit (sets status to VOID with a reversing effect). Use instead of delete for posted deposits. Confirm with the user first.",
    schema,
    handler,
};
