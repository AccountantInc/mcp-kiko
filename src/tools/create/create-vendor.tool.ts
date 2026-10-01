import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksVendor } from "../../handlers/create-kikobooks-vendor.handler.js";

const toolSchema = z.object({
    vendor: z.object({
        displayName: z.string().describe("Vendor display name"),
        companyName: z.string().optional().describe("Company name"),
        givenName: z.string().optional().describe("First name"),
        familyName: z.string().optional().describe("Last name"),
        email: z.string().optional().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        billingAddressLine1: z.string().optional(),
        billingAddressCity: z.string().optional(),
        billingAddressState: z.string().optional(),
        billingAddressPostalCode: z.string().optional(),
        billingAddressCountry: z.string().optional(),
        currencyCode: z.string().optional().describe("Currency code (e.g., 'USD')"),
        paymentTermsCode: z.string().optional().describe("Payment terms code"),
        taxId: z.string().optional().describe("Tax ID / EIN"),
        is1099Eligible: z.boolean().optional().describe("Whether vendor is 1099 eligible"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksVendor(args.vendor);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error creating vendor: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Vendor created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateVendorTool: ToolDefinition = {
    name: "create_vendor",
    description: "Create a new vendor in KikoBooks. Requires display name. Optionally include contact details, address, and 1099 eligibility.",
    schema: toolSchema,
    handler: toolHandler,
};
