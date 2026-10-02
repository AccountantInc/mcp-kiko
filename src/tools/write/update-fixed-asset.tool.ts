import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("GL_FixedAsset_Id to update"),
    assetName: z.string().describe("Asset name"),
    acquisitionDate: z.string().describe("Acquisition date (YYYY-MM-DD)"),
    acquisitionCost: z.number().describe("Acquisition cost"),
    description: z.string().optional().describe("Description"),
    categoryCode: z.string().optional().describe("Asset category code"),
    serialNumber: z.string().optional().describe("Serial number"),
    modelNumber: z.string().optional().describe("Model number"),
    manufacturer: z.string().optional().describe("Manufacturer"),
    location: z.string().optional().describe("Location"),
    department: z.string().optional().describe("Department"),
    assignedToUserId: z.number().optional().describe("Assigned user id"),
    acquisitionMethod: z.string().optional().describe("Acquisition method"),
    poNumber: z.string().optional().describe("Purchase order number"),
    vendorCustomerIdStr: z.string().optional().describe("Vendor/customer reference"),
    depreciationMethodCode: z.string().optional().describe("Depreciation method code"),
    usefulLifeMonths: z.number().optional().describe("Useful life in months"),
    salvageValue: z.number().optional().describe("Salvage/residual value"),
    depreciationStartDate: z.string().optional().describe("Depreciation start date (YYYY-MM-DD)"),
    assetAccountId: z.number().optional().describe("GL asset account id"),
    accumDepreciationAccountId: z.number().optional().describe("GL accumulated-depreciation account id"),
    depreciationExpenseAccountId: z.number().optional().describe("GL depreciation-expense account id"),
});

const handler = async (args: any) => {
    try {
        const { id, ...body } = args;
        const res = await kikoBooksClient.put(`/api/GL/FixedAssets/${id}`, body);
        return { content: [{ type: "text" as const, text: "Fixed asset updated:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error updating fixed asset: ${formatError(e)}` }] };
    }
};

export const UpdateFixedAssetTool: ToolDefinition = {
    name: "update_fixed_asset",
    description: "Update a fixed asset. Financial fields are locked once depreciation has been posted. Confirm with the user first.",
    schema,
    handler,
};
