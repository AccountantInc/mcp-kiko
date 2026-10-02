import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    asOfDate: z.string().optional().describe("Balances as of this date (YYYY-MM-DD). Default: today"),
    accountCategory: z.string().optional().describe("Filter by account category (e.g. Asset, Liability, Equity, Income, Expense)"),
    accountType: z.string().optional().describe("Filter by account type"),
    accountCode: z.string().optional().describe("Filter to a single account code"),
    includeHeaders: z.boolean().optional().describe("Include header/roll-up accounts (default: false)"),
    topN: z.number().optional().describe("Max rows to return (default: 200)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.get("/api/agent-reports/trial-balance", {
            asOfDate: args.asOfDate,
            accountCategory: args.accountCategory,
            accountType: args.accountType,
            accountCode: args.accountCode,
            includeHeaders: args.includeHeaders,
            topN: args.topN,
        });
        return { content: [{ type: "text" as const, text: "Trial balance:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting trial balance: ${formatError(e)}` }] };
    }
};

export const GetTrialBalanceTool: ToolDefinition = {
    name: "get_trial_balance",
    description:
        "Get the trial balance (debit/credit balances per GL account) as of a date. Read-only financial report. Optionally filter by account category, type, or code.",
    schema,
    handler,
};
