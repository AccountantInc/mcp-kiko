import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksInvoice(
    invoiceData: any
): Promise<ToolResponse<any>> {
    try {
        const rawLines = Array.isArray(invoiceData?.lines ?? invoiceData?.Lines ?? invoiceData?.lineItems)
            ? (invoiceData.lines ?? invoiceData.Lines ?? invoiceData.lineItems)
            : [];
        const lines = rawLines.map((line: any, index: number) => ({
            lineNumber: line?.lineNumber ?? index + 1,
            description: line?.description ?? line?.Description,
            quantity: line?.quantity ?? line?.Quantity ?? 1,
            unitPrice: line?.unitPrice ?? line?.UnitPrice ?? 0,
            AR_Item_Id: line?.AR_Item_Id ?? line?.ar_Item_Id ?? line?.itemId,
            GL_Account_Id: line?.GL_Account_Id ?? line?.gl_Account_Id ?? line?.accountId,
            taxCode: line?.taxCode ?? line?.TaxCode,
            isTaxable: Boolean(line?.isTaxable ?? line?.IsTaxable ?? line?.taxCode ?? line?.TaxCode),
        }));

        const hasAddress =
            invoiceData?.billingAddressLine1 ||
            invoiceData?.billingAddressCity ||
            invoiceData?.billingAddressState ||
            invoiceData?.billingAddressPostalCode ||
            invoiceData?.billingAddressCountry;

        const payload = {
            ...invoiceData,
            Customer_Id:
                invoiceData?.Customer_Id ??
                invoiceData?.customer_Id ??
                invoiceData?.customerId,
            invoiceDate: invoiceData?.invoiceDate ?? invoiceData?.InvoiceDate,
            dueDate: invoiceData?.dueDate ?? invoiceData?.DueDate,
            termsCode: invoiceData?.termsCode ?? invoiceData?.TermsCode,
            currencyCode: invoiceData?.currencyCode ?? invoiceData?.CurrencyCode,
            internalMemo:
                invoiceData?.internalMemo ??
                invoiceData?.InternalMemo ??
                invoiceData?.memo,
            billToAddress:
                invoiceData?.billToAddress ??
                (hasAddress
                    ? {
                          line1: invoiceData?.billingAddressLine1,
                          city: invoiceData?.billingAddressCity,
                          state: invoiceData?.billingAddressState,
                          postalCode: invoiceData?.billingAddressPostalCode,
                          country: invoiceData?.billingAddressCountry,
                      }
                    : undefined),
            lines,
        };
        const response = await kikoBooksClient.post("/api/Invoices", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
