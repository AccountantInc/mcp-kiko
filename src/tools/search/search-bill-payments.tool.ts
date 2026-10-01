import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { searchKikoBooksBillPayments } from "../../handlers/search-kikobooks-bill-payments.handler.js";

const toolSchema = z.object({
    vendorId: z.number().optional().describe("Filter by vendor ID"),
    fromDate: z.string().optional().describe("Filter payments from this date (YYYY-MM-DD)"),
    toDate: z.string().optional().describe("Filter payments to this date (YYYY-MM-DD)"),
    status: z.string().optional().describe("Filter by payment status"),
    paymentMethod: z.string().optional().describe("Filter by payment method"),
    search: z.string().optional().describe("Search by check number, memo, or reference"),
    page: z.number().optional().describe("Page number (default: 1)"),
    pageSize: z.number().optional().describe("Number of results per page (default: 50)"),
});

const toolHandler = async (args: any) => {
    const response = await searchKikoBooksBillPayments(args);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error searching bill payments: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "bill payments:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const SearchBillPaymentsTool: ToolDefinition = {
    name: "search_bill_payments",
    description:
        "List bill payments (AP) from KikoBooks. Supports filtering by vendor, status, payment method, date range, and text search. Returns paginated results.",
    schema: toolSchema,
    handler: toolHandler,
};
