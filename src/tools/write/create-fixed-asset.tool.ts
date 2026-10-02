import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

// Mirrors SaveFixedAssetDto
const schema = z.object({
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
    depreciationMethodCode: z.string().optional().describe("Depreciation method code (e.g. StraightLine)"),
    usefulLifeMonths: z.number().optional().describe("Useful life in months"),
    salvageValue: z.number().optional().describe("Salvage/residual value"),
    depreciationStartDate: z.string().optional().describe("Depreciation start date (YYYY-MM-DD)"),
    assetAccountId: z.number().optional().describe("GL asset account id"),
    accumDepreciationAccountId: z.number().optional().describe("GL accumulated-depreciation account id"),
    depreciationExpenseAccountId: z.number().optional().describe("GL depreciation-expense account id"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post("/api/GL/FixedAssets", args);
        return { content: [{ type: "text" as const, text: "Fixed asset created:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error creating fixed asset: ${formatError(e)}` }] };
    }
};

export const CreateFixedAssetTool: ToolDefinition = {
    name: "create_fixed_asset",
    description:
        "Register a new fixed asset, optionally with depreciation settings (method, useful life, salvage, GL accounts). Preview and confirm with the user first.",
    schema,
    handler,
};
