import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksItem(itemId: number, itemData: any): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(`/api/Items/${itemId}`);
        const existing = existingRes?.response ?? existingRes ?? {};

        const revAccountId =
            itemData?.DefaultRevenueAccount_Id ??
            itemData?.defaultRevenueAccount_Id ??
            itemData?.incomeAccountId ??
            existing?.defaultRevenueAccount_Id ??
            existing?.DefaultRevenueAccount_Id;
        const expAccountId =
            itemData?.DefaultExpenseAccount_Id ??
            itemData?.defaultExpenseAccount_Id ??
            itemData?.expenseAccountId ??
            existing?.defaultExpenseAccount_Id ??
            existing?.DefaultExpenseAccount_Id;

        const payload = {
            AR_Item_Id: itemId,
            itemCode:
                itemData?.itemCode ??
                existing?.itemCode ??
                existing?.ItemCode,
            name:
                itemData?.name ??
                itemData?.Name ??
                existing?.name ??
                existing?.Name,
            description:
                itemData?.description !== undefined
                    ? itemData.description
                    : (existing?.description ?? existing?.Description),
            itemType:
                itemData?.itemType ??
                itemData?.type ??
                existing?.itemType ??
                existing?.ItemType ??
                "SERVICE",
            usageScope:
                itemData?.usageScope ??
                existing?.usageScope ??
                existing?.UsageScope ??
                (revAccountId && expAccountId
                    ? "BOTH"
                    : expAccountId && !revAccountId
                      ? "AP"
                      : "AR"),
            pricingModel:
                itemData?.pricingModel ??
                existing?.pricingModel ??
                existing?.PricingModel ??
                "FIXED",
            defaultUnitPrice:
                itemData?.defaultUnitPrice ??
                itemData?.unitPrice ??
                existing?.defaultUnitPrice ??
                existing?.DefaultUnitPrice ??
                0,
            defaultCurrencyCode:
                itemData?.defaultCurrencyCode ??
                existing?.defaultCurrencyCode ??
                existing?.DefaultCurrencyCode ??
                "USD",
            unitOfMeasure:
                existing?.unitOfMeasure ?? existing?.UnitOfMeasure,
            isTaxable:
                itemData?.isTaxable !== undefined || itemData?.taxable !== undefined
                    ? Boolean(itemData?.isTaxable ?? itemData?.taxable)
                    : Boolean(existing?.isTaxable ?? existing?.IsTaxable),
            defaultTaxCode:
                existing?.defaultTaxCode ?? existing?.DefaultTaxCode,
            DefaultRevenueAccount_Id: revAccountId,
            DefaultDeferredRevenueAccount_Id:
                existing?.defaultDeferredRevenueAccount_Id ??
                existing?.DefaultDeferredRevenueAccount_Id,
            DefaultDiscountAccount_Id:
                existing?.defaultDiscountAccount_Id ??
                existing?.DefaultDiscountAccount_Id,
            DefaultExpenseAccount_Id: expAccountId,
            recognitionMethod:
                existing?.recognitionMethod ?? existing?.RecognitionMethod,
            defaultTermMonths:
                existing?.defaultTermMonths ?? existing?.DefaultTermMonths,
            priceTiers: existing?.priceTiers ?? existing?.PriceTiers,
        };
        const response = await kikoBooksClient.put(`/api/Items/${itemId}`, payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
