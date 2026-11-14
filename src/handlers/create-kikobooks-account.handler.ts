import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksAccount(
    accountData: any
): Promise<ToolResponse<any>> {
    try {
        const payload = {
            ...accountData,
            AccountType_Code:
                accountData?.AccountType_Code ?? accountData?.accountTypeCode,
            parent_GL_Account_Id:
                accountData?.parent_GL_Account_Id ??
                accountData?.Parent_GL_Account_Id ??
                accountData?.parentGLAccountId,
        };
        const response = await kikoBooksClient.post(
            "/api/GL/Accounts",
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
