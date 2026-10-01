import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksCustomer } from "../../handlers/update-kikobooks-customer.handler.js";

const toolSchema = z.object({
    customer_id: z.number().describe("The Customer ID to update"),
    customer: z.object({
        displayName: z.string().optional().describe("Updated display name"),
        companyName: z.string().optional().describe("Updated company name"),
        givenName: z.string().optional().describe("Updated first name"),
        familyName: z.string().optional().describe("Updated last name"),
        email: z.string().optional().describe("Updated email"),
        phone: z.string().optional().describe("Updated phone"),
        billingAddressLine1: z.string().optional(),
        billingAddressCity: z.string().optional(),
        billingAddressState: z.string().optional(),
        billingAddressPostalCode: z.string().optional(),
        billingAddressCountry: z.string().optional(),
        currencyCode: z.string().optional(),
        termsCode: z.string().optional(),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksCustomer(
        args.customer_id,
        args.customer
    );

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error updating customer: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Customer updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateCustomerTool: ToolDefinition = {
    name: "update_customer",
    description:
        "Update an existing customer in KikoBooks. Provide the customer ID and the fields to update.",
    schema: toolSchema,
    handler: toolHandler,
};
