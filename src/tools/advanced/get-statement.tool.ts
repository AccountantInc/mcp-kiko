import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Statement ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/Statements/${args.id}`);
        return { content: [{ type: "text" as const, text: "Customer statement:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting statement: ${formatError(e)}` }] };
    }
};

export const GetStatementTool: ToolDefinition = {
    name: "get_statement",
    description: "Get full details of a single customer statement by ID. Read-only.",
    schema,
    handler,
};
