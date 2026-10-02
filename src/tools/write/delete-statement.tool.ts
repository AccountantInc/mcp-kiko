import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Statement ID to delete (DRAFT only)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.delete(`/api/Statements/${args.id}`);
        return { content: [{ type: "text" as const, text: "Statement deleted:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error deleting statement: ${formatError(e)}` }] };
    }
};

export const DeleteStatementTool: ToolDefinition = {
    name: "delete_statement",
    description: "Soft-delete a DRAFT customer statement. Confirm with the user first.",
    schema,
    handler,
};
