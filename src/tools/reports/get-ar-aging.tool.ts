import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({});

const handler = async () => {
    try {
        const res = await kikoBooksClient.get("/api/Insights/ar-aging");
        return { content: [{ type: "text" as const, text: "AR aging brackets:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting AR aging: ${formatError(e)}` }] };
    }
};

export const GetArAgingTool: ToolDefinition = {
    name: "get_ar_aging",
    description:
        "Get accounts-receivable aging brackets (current, 1-30, 31-60, 61-90, 90+ days) — how much customers owe and how overdue. Read-only report.",
    schema,
    handler,
};
