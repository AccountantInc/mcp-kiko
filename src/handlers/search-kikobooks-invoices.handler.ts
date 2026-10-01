import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Search AR invoices. Parameter names map 1:1 to the live
 * `GET /api/Invoices` query contract (snake_case) — do not rename without
 * re-checking InvoicesController.
 */
export async function searchKikoBooksInvoices(params: {
    search?: string;
    status?: string;
    customerId?: number;
    invoiceDateFrom?: string;
    invoiceDateTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    isOverdue?: boolean;
    hasBalance?: boolean;
    termsCode?: string;
    currencyCode?: string;
    isPosted?: boolean;
    srcProvider?: string;
    page?: number;
    pageSize?: number;
    sortColumn?: string;
    sortDirection?: string;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.get("/api/Invoices", {
            search: params.search,
            status: params.status,
            customer_id: params.customerId,
            invoice_date_from: params.invoiceDateFrom,
            invoice_date_to: params.invoiceDateTo,
            due_date_from: params.dueDateFrom,
            due_date_to: params.dueDateTo,
            is_overdue: params.isOverdue,
            has_balance: params.hasBalance,
            terms_code: params.termsCode,
            currency_code: params.currencyCode,
            is_posted: params.isPosted,
            src_provider: params.srcProvider,
            page: params.page,
            page_size: params.pageSize,
            sort_column: params.sortColumn,
            sort_direction: params.sortDirection,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
