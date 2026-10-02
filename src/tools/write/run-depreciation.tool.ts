import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    fiscalYear: z.number().describe("Fiscal year to run depreciation for"),
    periodNumber: z.number().describe("Fiscal period number to run depreciation for"),
});

const handler = async (args: any) => {
    try {
        const qs = `?fiscalYear=${encodeURIComponent(args.fiscalYear)}&periodNumber=${encodeURIComponent(args.periodNumber)}`;
        const res = await kikoBooksClient.post(`/api/GL/FixedAssets/run-depreciation${qs}`);
        return { content: [{ type: "text" as const, text: "Depreciation run:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error running depreciation: ${formatError(e)}` }] };
    }
};

export const RunDepreciationTool: ToolDefinition = {
    name: "run_depreciation",
    description:
        "Run depreciation for a fiscal year + period — posts all unposted depreciation schedule entries and updates accumulated depreciation. Posts to the GL. Confirm with the user first.",
    schema,
    handler,
};
