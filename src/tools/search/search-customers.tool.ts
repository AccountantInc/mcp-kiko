import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksCustomers } from "../../handlers/search-kikobooks-customers.handler.js";

const toolSchema = z.object({
    search: z
        .string()
        .optional()
        .describe("Search by customer name, company, or email"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z
        .number()
        .optional()
        .describe("Results per page (default: 50, max: 500)"),
    sortColumn: z
        .string()
        .optional()
        .describe("Column to sort by (e.g., 'DisplayName', 'CompanyName')"),
    sortDirection: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksCustomers(args);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error searching customers: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Customers:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchCustomersTool: ToolDefinition = {
    name: "search_customers",
    description:
        "Search customers in KikoBooks. Supports text search across name, company, and email. Returns paginated results with sorting options.",
    schema: toolSchema,
    handler: toolHandler,
};
