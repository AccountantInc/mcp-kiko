import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Deposit ID to delete (DRAFT only)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.delete(`/api/Deposits/${args.id}`);
        return { content: [{ type: "text" as const, text: "Deposit deleted:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error deleting deposit: ${formatError(e)}` }] };
    }
};

export const DeleteDepositTool: ToolDefinition = {
    name: "delete_deposit",
    description: "Soft-delete a DRAFT deposit. Posted deposits must be voided, not deleted. Confirm with the user first.",
    schema,
    handler,
};
