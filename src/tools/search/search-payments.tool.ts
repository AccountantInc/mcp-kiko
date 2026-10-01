import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksPayments } from "../../handlers/search-kikobooks-payments.handler.js";

const toolSchema = z.object({
    search: z.string().optional().describe("Search by reference number, check number, or memo"),
    status: z.string().optional().describe("Filter by payment status (e.g., 'Draft', 'Posted', 'Voided')"),
    customer_id: z.number().optional().describe("Filter by customer ID"),
    payment_method_code: z.string().optional().describe("Filter by payment method (e.g., 'CHECK', 'CREDIT_CARD', 'ACH')"),
    payment_date_from: z.string().optional().describe("Filter payments from this date (YYYY-MM-DD)"),
    payment_date_to: z.string().optional().describe("Filter payments to this date (YYYY-MM-DD)"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Number of results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksPayments(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching payments: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Payments:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchPaymentsTool: ToolDefinition = {
    name: "search_payments",
    description:
        "List customer payments (AR) from KikoBooks. Supports filtering by customer, status, payment method, date range, and text search. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
