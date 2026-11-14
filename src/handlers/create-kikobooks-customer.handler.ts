import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksCustomer(
    customerData: any
): Promise<ToolResponse<any>> {
    try {
        const composedName = [customerData?.givenName, customerData?.familyName]
            .filter(Boolean)
            .join(" ")
            .trim();
        const payload = {
            ...customerData,
            displayName:
                customerData?.displayName ??
                customerData?.DisplayName ??
                (composedName || customerData?.companyName),
            companyName:
                customerData?.companyName ?? customerData?.CompanyName,
            email: customerData?.email ?? customerData?.Email,
            phone: customerData?.phone ?? customerData?.Phone,
            billingLine1:
                customerData?.billingLine1 ??
                customerData?.BillingLine1 ??
                customerData?.billingAddressLine1,
            billingCity:
                customerData?.billingCity ??
                customerData?.BillingCity ??
                customerData?.billingAddressCity,
            billingState:
                customerData?.billingState ??
                customerData?.BillingState ??
                customerData?.billingAddressState,
            billingPostalCode:
                customerData?.billingPostalCode ??
                customerData?.BillingPostalCode ??
                customerData?.billingAddressPostalCode,
            billingCountry:
                customerData?.billingCountry ??
                customerData?.BillingCountry ??
                customerData?.billingAddressCountry ??
                "US",
            paymentTermsCode:
                customerData?.paymentTermsCode ??
                customerData?.PaymentTermsCode ??
                customerData?.termsCode,
        };
        const response = await kikoBooksClient.post("/api/Customers/create", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
