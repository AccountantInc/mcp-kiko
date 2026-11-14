import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksBill(billData: any): Promise<ToolResponse<any>> {
    try {
        const rawLines = Array.isArray(billData?.lines ?? billData?.Lines ?? billData?.lineItems)
            ? (billData.lines ?? billData.Lines ?? billData.lineItems)
            : [];
        const lines = rawLines.map((line: any, index: number) => ({
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
            taxableFlag: Boolean(line?.taxableFlag ?? line?.taxCode ?? line?.TaxCode),
        }));

        const payload = {
            ...billData,
            AP_Vendor_Id:
                billData?.AP_Vendor_Id ??
                billData?.ap_Vendor_Id ??
                billData?.vendorId,
            billDate: billData?.billDate ?? billData?.BillDate,
            dueDate: billData?.dueDate ?? billData?.DueDate,
            billNumber: billData?.billNumber ?? billData?.BillNumber,
            memo: billData?.memo ?? billData?.Memo,
            lines,
        };
        const response = await kikoBooksClient.post("/api/Bills", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
