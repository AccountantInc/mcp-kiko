import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksInvoice(
    invoiceId: number,
    invoiceData: any
): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(
            `/api/Invoices/${invoiceId}`
        );
        const existing = existingRes?.response ?? existingRes ?? {};
        const currentStatus = String(existing?.status ?? existing?.Status ?? "").toUpperCase();

        // Non-draft invoices only allow annotation updates on /metadata (or void via /void).
        if (currentStatus && currentStatus !== "DRAFT") {
            if (invoiceData?.memo !== undefined || invoiceData?.internalMemo !== undefined) {
                const response = await kikoBooksClient.put(
                    `/api/Invoices/${invoiceId}/metadata`,
                    {
                        internalMemo: invoiceData?.internalMemo ?? invoiceData?.memo,
                    }
                );
                return { result: response, isError: false, error: null };
            }
        }

        const existingLines = Array.isArray(existing?.lines ?? existing?.Lines)
            ? (existing.lines ?? existing.Lines)
            : [];
        const rawIncomingLines = invoiceData?.lines ?? invoiceData?.Lines ?? invoiceData?.lineItems;
        const lines = Array.isArray(rawIncomingLines)
            ? rawIncomingLines.map((line: any, index: number) => ({
                  lineNumber: line?.lineNumber ?? index + 1,
                  description: line?.description ?? line?.Description,
                  quantity: line?.quantity ?? line?.Quantity ?? 1,
                  unitPrice: line?.unitPrice ?? line?.UnitPrice ?? 0,
                  AR_Item_Id: line?.AR_Item_Id ?? line?.ar_Item_Id ?? line?.itemId,
                  GL_Account_Id: line?.GL_Account_Id ?? line?.gl_Account_Id ?? line?.accountId,
                  taxCode: line?.taxCode ?? line?.TaxCode,
                  isTaxable: Boolean(line?.isTaxable ?? line?.IsTaxable ?? line?.taxCode),
              }))
            : existingLines;

        const payload = {
            AR_Invoice_Id: invoiceId,
            Customer_Id:
                invoiceData?.Customer_Id ??
                invoiceData?.customerId ??
                existing?.customer_Id ??
                existing?.Customer_Id,
            invoiceNumber: existing?.invoiceNumber ?? existing?.InvoiceNumber,
            invoiceDate:
                invoiceData?.invoiceDate ??
                existing?.invoiceDate ??
                existing?.InvoiceDate,
            dueDate:
                invoiceData?.dueDate ??
                existing?.dueDate ??
                existing?.DueDate,
            termsCode:
                invoiceData?.termsCode ??
                existing?.termsCode ??
                existing?.TermsCode,
            currencyCode:
                invoiceData?.currencyCode ??
                existing?.currencyCode ??
                existing?.CurrencyCode,
            internalMemo:
                invoiceData?.internalMemo ??
                invoiceData?.memo ??
                existing?.internalMemo ??
                existing?.InternalMemo,
            messageToCustomer:
                invoiceData?.messageToCustomer ??
                existing?.messageToCustomer ??
                existing?.MessageToCustomer,
            billToAddress: existing?.billToAddress ?? existing?.BillToAddress,
            shipToAddress: existing?.shipToAddress ?? existing?.ShipToAddress,
            lines,
        };

        const response = await kikoBooksClient.put(
            `/api/Invoices/${invoiceId}`,
            payload
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
