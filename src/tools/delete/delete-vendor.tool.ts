import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { deleteKikoBooksVendor } from "../../handlers/delete-kikobooks-vendor.handler.js";

const toolSchema = z.object({
    vendor_id: z.number().describe("The Vendor ID to delete (soft delete — sets inactive)"),
});

const toolHandler = async (args: any) => {
    const response = await deleteKikoBooksVendor(args.vendor_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error deleting vendor: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Vendor deleted:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const DeleteVendorTool: ToolDefinition = {
    name: "delete_vendor",
    description:
        "Delete (deactivate) a vendor in KikoBooks. This performs a soft delete by setting the vendor as inactive.",
    schema: toolSchema,
    handler: toolHandler,
};
