import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({});

const handler = async () => {
    try {
        const res = await kikoBooksClient.get("/api/InsightsDashboard/business-health");
        return { content: [{ type: "text" as const, text: "Business health:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting business health: ${formatError(e)}` }] };
    }
};

export const GetBusinessHealthTool: ToolDefinition = {
    name: "get_business_health",
    description:
        "Get the overall business-health summary (composite financial health indicators and scores) for the organization. Read-only dashboard report.",
    schema,
    handler,
};
