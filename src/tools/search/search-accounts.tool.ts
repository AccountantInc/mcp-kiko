import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksAccounts } from "../../handlers/search-kikobooks-accounts.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by account name or number"),
    category: z
        .enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"])
        .optional()
        .describe("Filter by account category"),
    type: z.string().optional().describe("Filter by account type code"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z
        .number()
        .optional()
        .describe("Number of results per page (default: 50, max: 500)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksAccounts(args);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error searching accounts: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Accounts:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchAccountsTool: ToolDefinition = {
    name: "search_accounts",
    description:
        "List chart of accounts from KikoBooks. Supports filtering by category (ASSET, LIABILITY, EQUITY, INCOME, EXPENSE), type, and text search. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
