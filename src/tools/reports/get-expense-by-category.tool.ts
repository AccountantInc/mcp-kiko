import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    periodBucket: z.number().optional().describe("Optional period bucket filter (integer); omit for the default view"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/Insights/expense-by-category", {
            periodBucket: args.periodBucket,
        });
        return { content: [{ type: "text" as const, text: "Expense by category:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting expense by category: ${formatError(e)}` }] };
    }
};

export const GetExpenseByCategoryTool: ToolDefinition = {
    name: "get_expense_by_category",
    description:
        "Get the expense breakdown grouped by category/account. Read-only report for understanding where money is being spent.",
    schema,
    handler,
};
