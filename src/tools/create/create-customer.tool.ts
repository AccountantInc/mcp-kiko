import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksCustomer } from "../../handlers/create-kikobooks-customer.handler.js";

const toolSchema = z.object({
    customer: z.object({
        displayName: z.string().describe("Customer display name"),
        companyName: z.string().optional().describe("Company name"),
        givenName: z.string().optional().describe("First name"),
        familyName: z.string().optional().describe("Last name"),
        email: z.string().optional().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        mobile: z.string().optional().describe("Mobile number"),
        billingAddressLine1: z.string().optional().describe("Billing address line 1"),
        billingAddressCity: z.string().optional().describe("Billing city"),
        billingAddressState: z.string().optional().describe("Billing state"),
        billingAddressPostalCode: z.string().optional().describe("Billing postal code"),
        billingAddressCountry: z.string().optional().describe("Billing country"),
        currencyCode: z
            .string()
            .optional()
            .describe("Currency code (e.g., 'USD')"),
        termsCode: z.string().optional().describe("Payment terms code"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksCustomer(args.customer);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error creating customer: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Customer created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateCustomerTool: ToolDefinition = {
    name: "create_customer",
    description:
        "Create a new customer in KikoBooks. Requires at minimum a display name. Optionally include contact details, billing address, and payment terms.",
    schema: toolSchema,
    handler: toolHandler,
};
