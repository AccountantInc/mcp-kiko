import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID to resume"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/RecurringSchedules/${args.id}/resume`);
        return { content: [{ type: "text" as const, text: "Recurring schedule resumed:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error resuming recurring schedule: ${formatError(e)}` }] };
    }
};

export const ResumeRecurringScheduleTool: ToolDefinition = {
    name: "resume_recurring_schedule",
    description: "Resume a paused recurring invoice schedule. Confirm with the user first.",
    schema,
    handler,
};
