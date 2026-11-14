import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function updateKikoBooksAccount(
    accountId: number,
    accountData: any
): Promise<ToolResponse<any>> {
    try {
        const existingRes = await kikoBooksClient.get<any>(
            `/api/GL/Accounts/${accountId}`
        );
        const existing = existingRes?.response ?? existingRes ?? {};

        const payload = {
            GL_Account_Id: accountId,
            accountNumber:
                accountData?.accountNumber ?? existing?.accountNumber,
            accountName: accountData?.accountName ?? existing?.accountName,
            description:
                accountData?.description !== undefined
                    ? accountData.description
                    : existing?.description,
            accountCategoryCode:
                accountData?.accountCategoryCode ??
                existing?.accountCategory_Code ??
                existing?.accountCategoryCode,
            AccountType_Code:
                accountData?.AccountType_Code ??
                accountData?.accountTypeCode ??
                existing?.accountType_Code ??
                existing?.AccountType_Code,
            detailTypeCode:
                accountData?.detailTypeCode ??
                existing?.detailType_Code ??
                existing?.detailTypeCode,
            parent_GL_Account_Id:
                accountData?.parent_GL_Account_Id !== undefined ||
                accountData?.parentGLAccountId !== undefined
                    ? (accountData?.parent_GL_Account_Id ??
                      accountData?.parentGLAccountId)
                    : (existing?.parent_GL_Account_Id ??
                      existing?.Parent_GL_Account_Id),
            isHeader: existing?.isHeader,
            allowDirectPosting: existing?.allowDirectPosting,
            taxLineMapping: existing?.taxLineMapping,
            cashFlowCategory: existing?.cashFlowCategory,
            normalBalanceOverride: existing?.normalBalanceOverride,
            openingBalance: existing?.openingBalance,
            openingBalanceDate: existing?.openingBalanceDate,
        };

        const response = await kikoBooksClient.put(
            `/api/GL/Accounts/${accountId}`,
            payload
        );

        return {
            result: response,
            isError: false,
            error: null,
        };
    } catch (error) {
        return {
            result: null,
            isError: true,
            error: formatError(error),
        };
    }
}
