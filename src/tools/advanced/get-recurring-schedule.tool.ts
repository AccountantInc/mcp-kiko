import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get(`/api/RecurringSchedules/${args.id}`);
        return { content: [{ type: "text" as const, text: "Recurring schedule:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting recurring schedule: ${formatError(e)}` }] };
    }
};

export const GetRecurringScheduleTool: ToolDefinition = {
    name: "get_recurring_schedule",
    description: "Get full details of a single recurring invoice schedule by ID. Read-only.",
    schema,
    handler,
};
