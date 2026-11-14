import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksVendor(vendorData: any): Promise<ToolResponse<any>> {
    try {
        const composedName = [vendorData?.givenName, vendorData?.familyName]
            .filter(Boolean)
            .join(" ")
            .trim();
        const payload = {
            ...vendorData,
            vendorName:
                vendorData?.vendorName ??
                vendorData?.VendorName ??
                vendorData?.displayName ??
                (composedName || vendorData?.companyName),
            companyName: vendorData?.companyName ?? vendorData?.CompanyName,
            email: vendorData?.email ?? vendorData?.Email,
            phone: vendorData?.phone ?? vendorData?.Phone,
            addressLine1:
                vendorData?.addressLine1 ??
                vendorData?.AddressLine1 ??
                vendorData?.billingAddressLine1,
            city:
                vendorData?.city ??
                vendorData?.City ??
                vendorData?.billingAddressCity,
            stateProvince:
                vendorData?.stateProvince ??
                vendorData?.StateProvince ??
                vendorData?.billingAddressState,
            postalCode:
                vendorData?.postalCode ??
                vendorData?.PostalCode ??
                vendorData?.billingAddressPostalCode,
            countryCode:
                vendorData?.countryCode ??
                vendorData?.CountryCode ??
                vendorData?.billingAddressCountry ??
                "US",
            currencyCode:
                vendorData?.currencyCode ??
                vendorData?.CurrencyCode ??
                "USD",
            tin: vendorData?.tin ?? vendorData?.TIN ?? vendorData?.taxId,
            is1099Eligible: Boolean(
                vendorData?.is1099Eligible ?? vendorData?.Is1099Eligible
            ),
        };
        const response = await kikoBooksClient.post("/api/Vendors", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
