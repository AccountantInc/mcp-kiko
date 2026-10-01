import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksEnabledModules } from "../../handlers/get-kikobooks-enabled-modules.handler.js";

const toolSchema = z.object({});

const toolHandler = async () => {
    const response = await getKikoBooksEnabledModules();

    if (response.isError) {
        return {
            content: [
                { type: "text" as const, text: `Error loading enabled modules: ${response.error}` },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Enabled modules and capabilities:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetEnabledModulesTool: ToolDefinition = {
    name: "get_enabled_modules",
    description:
        "List the modules and capabilities enabled for the connected organization. " +
        "Bookkeeping and AI are always available. CRM, Proposals (Sales), and Workflow " +
        "are mandatory for accounting firms (CA) but opt-in for self-service businesses (CB), " +
        "so call this before offering any sales, proposal, or job/workflow action — " +
        "if a module is not enabled, do not attempt its tools.",
    schema: toolSchema,
    handler: toolHandler,
};
