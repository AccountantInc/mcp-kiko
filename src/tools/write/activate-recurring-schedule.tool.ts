import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID to activate"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/RecurringSchedules/${args.id}/activate`);
        return { content: [{ type: "text" as const, text: "Recurring schedule activated:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error activating recurring schedule: ${formatError(e)}` }] };
    }
};

export const ActivateRecurringScheduleTool: ToolDefinition = {
    name: "activate_recurring_schedule",
    description: "Activate a DRAFT recurring invoice schedule so it begins generating invoices on its cadence. Confirm with the user first.",
    schema,
    handler,
};
