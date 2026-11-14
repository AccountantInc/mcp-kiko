import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksItem(itemData: any): Promise<ToolResponse<any>> {
    try {
        const revAccountId =
            itemData?.DefaultRevenueAccount_Id ??
            itemData?.defaultRevenueAccount_Id ??
            itemData?.incomeAccountId;
        const expAccountId =
            itemData?.DefaultExpenseAccount_Id ??
            itemData?.defaultExpenseAccount_Id ??
            itemData?.expenseAccountId;

        let inferredScope = itemData?.usageScope ?? itemData?.UsageScope;
        if (!inferredScope) {
            if (revAccountId && expAccountId) {
                inferredScope = "BOTH";
            } else if (expAccountId && !revAccountId) {
                inferredScope = "AP";
            } else {
                inferredScope = "AR";
            }
        }

        const payload = {
            ...itemData,
            name: itemData?.name ?? itemData?.Name,
            itemCode: itemData?.itemCode ?? itemData?.ItemCode,
            description: itemData?.description ?? itemData?.Description,
            itemType:
                itemData?.itemType ??
                itemData?.ItemType ??
                itemData?.type ??
                "SERVICE",
            usageScope: inferredScope,
            pricingModel:
                itemData?.pricingModel ?? itemData?.PricingModel ?? "FIXED",
            defaultUnitPrice:
                itemData?.defaultUnitPrice ??
                itemData?.DefaultUnitPrice ??
                itemData?.unitPrice ??
                0,
            defaultCurrencyCode:
                itemData?.defaultCurrencyCode ??
                itemData?.DefaultCurrencyCode ??
                "USD",
            isTaxable: Boolean(
                itemData?.isTaxable ?? itemData?.IsTaxable ?? itemData?.taxable
            ),
            DefaultRevenueAccount_Id: revAccountId,
            DefaultExpenseAccount_Id: expAccountId,
        };
        const response = await kikoBooksClient.post("/api/Items", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
