import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID to delete (DRAFT only)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.delete(`/api/RecurringSchedules/${args.id}`);
        return { content: [{ type: "text" as const, text: "Recurring schedule deleted:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error deleting recurring schedule: ${formatError(e)}` }] };
    }
};

export const DeleteRecurringScheduleTool: ToolDefinition = {
    name: "delete_recurring_schedule",
    description: "Soft-delete a DRAFT recurring invoice schedule. Confirm with the user first.",
    schema,
    handler,
};
