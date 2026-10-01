import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksAccount } from "../../handlers/create-kikobooks-account.handler.js";

const toolSchema = z.object({
    account: z.object({
        accountNumber: z.string().describe("Account number (e.g., '1000')"),
        accountName: z.string().describe("Display name for the account"),
        accountCategoryCode: z
            .enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"])
            .describe("Account category"),
        accountTypeCode: z
            .string()
            .describe(
                "Account type (e.g., 'BankAccount', 'OtherCurrentAsset', 'AccountsReceivable')"
            ),
        description: z.string().optional().describe("Account description"),
        parentGLAccountId: z
            .number()
            .optional()
            .describe("Parent account ID for sub-accounts"),
        openingBalance: z.number().optional().describe("Opening balance amount"),
        openingBalanceDate: z
            .string()
            .optional()
            .describe("Opening balance date (YYYY-MM-DD)"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksAccount(args.account);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error creating account: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Account created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateAccountTool: ToolDefinition = {
    name: "create_account",
    description:
        "Create a new account in the KikoBooks chart of accounts. Requires account number, name, category (ASSET/LIABILITY/EQUITY/INCOME/EXPENSE), and type code.",
    schema: toolSchema,
    handler: toolHandler,
};
