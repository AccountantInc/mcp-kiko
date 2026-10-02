import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

// Mirrors DisposeFixedAssetDto
const schema = z.object({
    id: z.number().describe("GL_FixedAsset_Id to dispose"),
    disposalDate: z.string().describe("Disposal date (YYYY-MM-DD)"),
    disposalType: z.string().describe("Disposal type (e.g. Sale, Scrap, Donation)"),
    disposalProceeds: z.number().describe("Proceeds received on disposal"),
    disposalCosts: z.number().optional().describe("Costs incurred to dispose"),
    disposalReason: z.string().optional().describe("Reason for disposal"),
    buyerName: z.string().optional().describe("Buyer name"),
    buyerContact: z.string().optional().describe("Buyer contact"),
    invoiceNumber: z.string().optional().describe("Sale invoice number"),
});

const handler = async (args: any) => {
    try {
        const { id, ...body } = args;
        const res = await kikoBooksClient.post(`/api/GL/FixedAssets/${id}/dispose`, body);
        return { content: [{ type: "text" as const, text: "Fixed asset disposed:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error disposing fixed asset: ${formatError(e)}` }] };
    }
};

export const DisposeFixedAssetTool: ToolDefinition = {
    name: "dispose_fixed_asset",
    description:
        "Dispose a fixed asset (sale/scrap/donation) — creates a disposal record and updates asset status, recognizing any gain/loss. Confirm with the user first.",
    schema,
    handler,
};
