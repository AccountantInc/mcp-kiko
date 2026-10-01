import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksAccount } from "../../handlers/update-kikobooks-account.handler.js";

const toolSchema = z.object({
    account_id: z.number().describe("The GL Account ID to update"),
    account: z.object({
        accountName: z.string().optional().describe("Updated account name"),
        description: z.string().optional().describe("Updated description"),
        accountTypeCode: z.string().optional().describe("Updated account type code"),
        parentGLAccountId: z
            .number()
            .optional()
            .describe("Updated parent account ID"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksAccount(
        args.account_id,
        args.account
    );

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error updating account: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Account updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateAccountTool: ToolDefinition = {
    name: "update_account",
    description:
        "Update an existing account in the KikoBooks chart of accounts. Provide the account ID and the fields to update.",
    schema: toolSchema,
    handler: toolHandler,
};
