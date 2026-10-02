import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Recurring schedule ID to generate an invoice from"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/RecurringSchedules/${args.id}/generate`);
        return { content: [{ type: "text" as const, text: "Invoice generated from recurring schedule:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error generating invoice from recurring schedule: ${formatError(e)}` }] };
    }
};

export const GenerateRecurringInvoiceTool: ToolDefinition = {
    name: "generate_recurring_invoice",
    description:
        "Generate an invoice now from a recurring schedule and advance its next-run date. Creates a DRAFT invoice. Confirm with the user first.",
    schema,
    handler,
};
