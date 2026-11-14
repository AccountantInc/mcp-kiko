import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksPurchase(
    purchaseData: any
): Promise<ToolResponse<any>> {
    try {
        const rawLines = Array.isArray(purchaseData?.lineItems)
            ? purchaseData.lineItems
            : [];
        const firstLine = rawLines[0] ?? {};
        const summedAmount = rawLines.reduce(
            (sum: number, line: any) => sum + Number(line?.amount ?? 0),
            0
        );
        const lineDescriptions = rawLines
            .map((l: any) => l?.description)
            .filter(Boolean)
            .join("; ");

        const payload = {
            ...purchaseData,
            AP_Vendor_Id:
                purchaseData?.AP_Vendor_Id ??
                purchaseData?.ap_Vendor_Id ??
                purchaseData?.vendorId,
            expenseDate:
                purchaseData?.expenseDate ?? purchaseData?.ExpenseDate,
            amount:
                purchaseData?.amount ??
                purchaseData?.Amount ??
                summedAmount,
            GL_Account_Id:
                purchaseData?.GL_Account_Id ??
                purchaseData?.gl_Account_Id ??
                purchaseData?.accountId ??
                firstLine?.accountId,
            Payment_GL_Account_Id:
                purchaseData?.Payment_GL_Account_Id ??
                purchaseData?.payment_GL_Account_Id ??
                purchaseData?.paymentAccountId,
            description:
                purchaseData?.description ??
                purchaseData?.Description ??
                purchaseData?.memo ??
                lineDescriptions,
            sourceReference:
                purchaseData?.sourceReference ??
                purchaseData?.SourceReference ??
                purchaseData?.referenceNumber,
            paymentMethodCode:
                purchaseData?.paymentMethodCode ??
                purchaseData?.PaymentMethodCode,
            autoPost: purchaseData?.autoPost ?? purchaseData?.AutoPost ?? false,
        };
        const response = await kikoBooksClient.post("/api/Expenses", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
