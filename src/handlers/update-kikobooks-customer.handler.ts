import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksCustomer(
    customerId: number,
    customerData: any
): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(
            `/api/Customers/${customerId}`
        );
        const existing = existingRes?.response ?? existingRes ?? {};

        const payload = {
            Customer_Id: customerId,
            displayName:
                customerData?.displayName ??
                customerData?.DisplayName ??
                existing?.displayName ??
                existing?.DisplayName,
            companyName:
                customerData?.companyName !== undefined
                    ? customerData.companyName
                    : (existing?.companyName ?? existing?.CompanyName),
            email:
                customerData?.email !== undefined
                    ? customerData.email
                    : (existing?.email ?? existing?.Email),
            phone:
                customerData?.phone !== undefined
                    ? customerData.phone
                    : (existing?.phone ?? existing?.Phone),
            website:
                customerData?.website !== undefined
                    ? customerData.website
                    : (existing?.website ?? existing?.Website),
            billingLine1:
                customerData?.billingLine1 ??
                customerData?.billingAddressLine1 ??
                existing?.billingLine1 ??
                existing?.BillingLine1,
            billingLine2:
                customerData?.billingLine2 ??
                existing?.billingLine2 ??
                existing?.BillingLine2,
            billingCity:
                customerData?.billingCity ??
                customerData?.billingAddressCity ??
                existing?.billingCity ??
                existing?.BillingCity,
            billingState:
                customerData?.billingState ??
                customerData?.billingAddressState ??
                existing?.billingState ??
                existing?.BillingState,
            billingPostalCode:
                customerData?.billingPostalCode ??
                customerData?.billingAddressPostalCode ??
                existing?.billingPostalCode ??
                existing?.BillingPostalCode,
            billingCountry:
                customerData?.billingCountry ??
                customerData?.billingAddressCountry ??
                existing?.billingCountry ??
                existing?.BillingCountry ??
                "US",
            shippingLine1: existing?.shippingLine1 ?? existing?.ShippingLine1,
            shippingLine2: existing?.shippingLine2 ?? existing?.ShippingLine2,
            shippingCity: existing?.shippingCity ?? existing?.ShippingCity,
            shippingState: existing?.shippingState ?? existing?.ShippingState,
            shippingPostalCode:
                existing?.shippingPostalCode ?? existing?.ShippingPostalCode,
            shippingCountry:
                existing?.shippingCountry ?? existing?.ShippingCountry,
            currencyCode:
                customerData?.currencyCode ??
                existing?.currencyCode ??
                existing?.CurrencyCode ??
                "USD",
            paymentTermsCode:
                customerData?.paymentTermsCode ??
                customerData?.termsCode ??
                existing?.paymentTermsCode ??
                existing?.PaymentTermsCode,
            taxExemptFlag:
                customerData?.taxExemptFlag ??
                existing?.taxExemptFlag ??
                existing?.TaxExemptFlag ??
                false,
            taxExemptionReason:
                existing?.taxExemptionReason ?? existing?.TaxExemptionReason,
            taxExemptionNumber:
                existing?.taxExemptionNumber ?? existing?.TaxExemptionNumber,
            creditLimit:
                customerData?.creditLimit ??
                existing?.creditLimit ??
                existing?.CreditLimit,
            notes:
                customerData?.notes !== undefined
                    ? customerData.notes
                    : (existing?.notes ?? existing?.Notes),
        };
        const response = await kikoBooksClient.put(
            `/api/Customers/${customerId}`,
            payload
        );
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
