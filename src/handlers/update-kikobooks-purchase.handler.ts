import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksPurchase(
    purchaseId: number,
    purchaseData: any
): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(
            `/api/Expenses/${purchaseId}`
        );
        const existing = existingRes?.response ?? existingRes ?? {};
        const currentStatus = String(existing?.status ?? existing?.Status ?? "").toUpperCase();

        if (currentStatus && currentStatus !== "DRAFT") {
            if (purchaseData?.memo !== undefined || purchaseData?.description !== undefined) {
                const response = await kikoBooksClient.put(
                    `/api/Expenses/${purchaseId}/metadata`,
                    {
                        description: purchaseData?.description ?? purchaseData?.memo,
                    }
                );
                return { result: response, isError: false, error: null };
            }
        }

        const payload = {
            AP_Vendor_Id:
                purchaseData?.AP_Vendor_Id ??
                purchaseData?.vendorId ??
                existing?.ap_Vendor_Id ??
                existing?.AP_Vendor_Id,
            expenseDate:
                purchaseData?.expenseDate ??
                existing?.expenseDate ??
                existing?.ExpenseDate,
            amount:
                purchaseData?.amount ??
                existing?.amount ??
                existing?.Amount,
            currencyCode:
                purchaseData?.currencyCode ??
                existing?.currencyCode ??
                existing?.CurrencyCode ??
                "USD",
            GL_Account_Id:
                purchaseData?.GL_Account_Id ??
                purchaseData?.accountId ??
                existing?.gl_Account_Id ??
                existing?.GL_Account_Id,
            Payment_GL_Account_Id:
                purchaseData?.Payment_GL_Account_Id ??
                purchaseData?.paymentAccountId ??
                existing?.payment_GL_Account_Id ??
                existing?.Payment_GL_Account_Id,
            description:
                purchaseData?.description ??
                purchaseData?.memo ??
                existing?.description ??
                existing?.Description,
            sourceReference:
                purchaseData?.sourceReference ??
                purchaseData?.referenceNumber ??
                existing?.sourceReference ??
                existing?.SourceReference,
            paymentMethodCode:
                purchaseData?.paymentMethodCode ??
                existing?.paymentMethodCode ??
                existing?.PaymentMethodCode,
        };

        const response = await kikoBooksClient.put(
            `/api/Expenses/${purchaseId}`,
            payload
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
