import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID to pause"),
    pauseReason: z.string().optional().describe("Reason for pausing"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/RecurringSchedules/${args.id}/pause`, { pauseReason: args.pauseReason });
        return { content: [{ type: "text" as const, text: "Recurring schedule paused:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error pausing recurring schedule: ${formatError(e)}` }] };
    }
};

export const PauseRecurringScheduleTool: ToolDefinition = {
    name: "pause_recurring_schedule",
    description: "Pause an active recurring invoice schedule so it stops generating invoices. Confirm with the user first.",
    schema,
    handler,
};
