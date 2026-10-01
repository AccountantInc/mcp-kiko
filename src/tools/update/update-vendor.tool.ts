import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { updateKikoBooksVendor } from "../../handlers/update-kikobooks-vendor.handler.js";

const toolSchema = z.object({
    vendor_id: z.number().describe("The Vendor ID to update"),
    vendor: z.object({
        displayName: z.string().optional(),
        companyName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        billingAddressLine1: z.string().optional(),
        billingAddressCity: z.string().optional(),
        billingAddressState: z.string().optional(),
        billingAddressPostalCode: z.string().optional(),
        billingAddressCountry: z.string().optional(),
        paymentTermsCode: z.string().optional(),
        taxId: z.string().optional(),
        is1099Eligible: z.boolean().optional(),
    }),
});

const toolHandler = async (args: any) => {
    const response = await updateKikoBooksVendor(args.vendor_id, args.vendor);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error updating vendor: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Vendor updated:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const UpdateVendorTool: ToolDefinition = {
    name: "update_vendor",
    description: "Update an existing vendor in KikoBooks. Provide the vendor ID and the fields to update.",
    schema: toolSchema,
    handler: toolHandler,
};
