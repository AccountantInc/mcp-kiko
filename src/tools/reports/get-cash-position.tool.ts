import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    asOfDate: z.string().optional().describe("Cash position as of this date (YYYY-MM-DD). Default: today"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/agent-reports/cash-position", {
            asOfDate: args.asOfDate,
        });
        return { content: [{ type: "text" as const, text: "Cash position:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting cash position: ${formatError(e)}` }] };
    }
};

export const GetCashPositionTool: ToolDefinition = {
    name: "get_cash_position",
    description:
        "Get the current cash position across GL cash accounts and bank accounts as of a date. Read-only report.",
    schema,
    handler,
};
