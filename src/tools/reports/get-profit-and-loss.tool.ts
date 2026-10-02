import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    trendPeriods: z.number().optional().describe("Number of monthly periods to return (default: 12)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/Insights/monthly-profit-loss", {
            trendPeriods: args.trendPeriods,
        });
        return { content: [{ type: "text" as const, text: "Profit & loss (monthly):" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting profit and loss: ${formatError(e)}` }] };
    }
};

export const GetProfitAndLossTool: ToolDefinition = {
    name: "get_profit_and_loss",
    description:
        "Get the monthly profit & loss (income statement) trend — revenue, expenses, and net profit per month. Read-only. Use trendPeriods to control how many months.",
    schema,
    handler,
};
