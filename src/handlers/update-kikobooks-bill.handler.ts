import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksBill(billId: number, billData: any): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(`/api/Bills/${billId}`);
        const existing = existingRes?.response ?? existingRes ?? {};
        const currentStatus = String(existing?.status ?? existing?.Status ?? "").toUpperCase();

        if (currentStatus && currentStatus !== "DRAFT") {
            if (billData?.memo !== undefined || billData?.notes !== undefined) {
                const response = await kikoBooksClient.put(`/api/Bills/${billId}/metadata`, {
                    memo: billData?.memo,
                    notes: billData?.notes,
                });
                return { result: response, isError: false, error: null };
            }
        }

        const existingLines = Array.isArray(existing?.lines ?? existing?.Lines)
            ? (existing.lines ?? existing.Lines)
            : [];
        const rawIncomingLines = billData?.lines ?? billData?.Lines ?? billData?.lineItems;
        const lines = Array.isArray(rawIncomingLines)
            ? rawIncomingLines.map((line: any, index: number) => ({
                  lineNumber: line?.lineNumber ?? index + 1,
                  lineType: line?.lineType ?? "EXPENSE",
                  description: line?.description ?? line?.Description,
                  quantity: line?.quantity ?? line?.Quantity ?? 1,
                  unitCost: line?.unitCost ?? line?.UnitCost ?? line?.amount ?? line?.Amount ?? 0,
                  amount: line?.amount ?? line?.Amount ?? 0,
                  GL_Account_Id:
                      line?.GL_Account_Id ??
                      line?.gl_Account_Id ??
                      line?.accountId,
                  taxCode: line?.taxCode ?? line?.TaxCode,
                  taxableFlag: Boolean(line?.taxableFlag ?? line?.taxCode),
              }))
            : existingLines;

        const payload = {
            AP_Bill_Id: billId,
            AP_Vendor_Id:
                billData?.AP_Vendor_Id ??
                billData?.vendorId ??
                existing?.ap_Vendor_Id ??
                existing?.AP_Vendor_Id,
            billNumber:
                billData?.billNumber ??
                existing?.billNumber ??
                existing?.BillNumber,
            billDate:
                billData?.billDate ??
                existing?.billDate ??
                existing?.BillDate,
            dueDate:
                billData?.dueDate ??
                existing?.dueDate ??
                existing?.DueDate,
            currencyCode:
                billData?.currencyCode ??
                existing?.currencyCode ??
                existing?.CurrencyCode ??
                "USD",
            termsCode:
                billData?.termsCode ??
                existing?.termsCode ??
                existing?.TermsCode,
            memo:
                billData?.memo !== undefined
                    ? billData.memo
                    : (existing?.memo ?? existing?.Memo),
            notes:
                billData?.notes !== undefined
                    ? billData.notes
                    : (existing?.notes ?? existing?.Notes),
            lines,
        };

        const response = await kikoBooksClient.put(`/api/Bills/${billId}`, payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
