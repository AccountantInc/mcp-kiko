import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksVendor(
    vendorId: number,
    vendorData: any
): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(`/api/Vendors/${vendorId}`);
        const existing = existingRes?.response ?? existingRes ?? {};

        const payload = {
            AP_Vendor_Id: vendorId,
            vendorCode: existing?.vendorCode ?? existing?.VendorCode,
            vendorName:
                vendorData?.vendorName ??
                vendorData?.VendorName ??
                vendorData?.displayName ??
                existing?.vendorName ??
                existing?.VendorName,
            vendorType:
                vendorData?.vendorType ??
                existing?.vendorType ??
                existing?.VendorType,
            companyName:
                vendorData?.companyName !== undefined
                    ? vendorData.companyName
                    : (existing?.companyName ?? existing?.CompanyName),
            email:
                vendorData?.email !== undefined
                    ? vendorData.email
                    : (existing?.email ?? existing?.Email),
            phone:
                vendorData?.phone !== undefined
                    ? vendorData.phone
                    : (existing?.phone ?? existing?.Phone),
            website:
                vendorData?.website !== undefined
                    ? vendorData.website
                    : (existing?.website ?? existing?.Website),
            addressLine1:
                vendorData?.addressLine1 ??
                vendorData?.billingAddressLine1 ??
                existing?.addressLine1 ??
                existing?.AddressLine1,
            addressLine2:
                vendorData?.addressLine2 ??
                existing?.addressLine2 ??
                existing?.AddressLine2,
            city:
                vendorData?.city ??
                vendorData?.billingAddressCity ??
                existing?.city ??
                existing?.City,
            stateProvince:
                vendorData?.stateProvince ??
                vendorData?.billingAddressState ??
                existing?.stateProvince ??
                existing?.StateProvince,
            postalCode:
                vendorData?.postalCode ??
                vendorData?.billingAddressPostalCode ??
                existing?.postalCode ??
                existing?.PostalCode,
            countryCode:
                vendorData?.countryCode ??
                vendorData?.billingAddressCountry ??
                existing?.countryCode ??
                existing?.CountryCode ??
                "US",
            currencyCode:
                vendorData?.currencyCode ??
                existing?.currencyCode ??
                existing?.CurrencyCode ??
                "USD",
            paymentTermsDays:
                vendorData?.paymentTermsDays ??
                existing?.paymentTermsDays ??
                existing?.PaymentTermsDays,
            defaultPaymentMethod_Id:
                existing?.defaultPaymentMethod_Id ??
                existing?.DefaultPaymentMethod_Id,
            defaultPurpose_Id:
                existing?.defaultPurpose_Id ??
                existing?.DefaultPurpose_Id,
            defaultExpenseAccount_Id:
                existing?.defaultExpenseAccount_Id ??
                existing?.DefaultExpenseAccount_Id,
            is1099Eligible:
                vendorData?.is1099Eligible !== undefined
                    ? Boolean(vendorData.is1099Eligible)
                    : Boolean(existing?.is1099Eligible ?? existing?.Is1099Eligible),
            form1099Type: existing?.form1099Type ?? existing?.Form1099Type,
            form1099Box: existing?.form1099Box ?? existing?.Form1099Box,
            tinType: existing?.tinType ?? existing?.TINType,
            tin: vendorData?.tin ?? vendorData?.TIN ?? vendorData?.taxId,
            notes:
                vendorData?.notes !== undefined
                    ? vendorData.notes
                    : (existing?.notes ?? existing?.Notes),
        };
        const response = await kikoBooksClient.put(`/api/Vendors/${vendorId}`, payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
