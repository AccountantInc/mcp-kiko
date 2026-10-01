import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksVendor } from "../../handlers/get-kikobooks-vendor.handler.js";

const toolSchema = z.object({
    vendor_id: z.number().describe("The Vendor ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksVendor(args.vendor_id);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error getting vendor: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Vendor details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetVendorTool: ToolDefinition = {
    name: "get_vendor",
    description: "Get a single vendor by ID from KikoBooks. Returns full vendor details including contact, addresses, and payment terms.",
    schema: toolSchema,
    handler: toolHandler,
};
