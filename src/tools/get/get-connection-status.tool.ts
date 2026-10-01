import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksConnectionStatus } from "../../handlers/get-kikobooks-connection-status.handler.js";

const toolSchema = z.object({});

const toolHandler = async () => {
    const response = await getKikoBooksConnectionStatus();

    if (response.isError) {
        return {
            content: [
                { type: "text" as const, text: `Error checking connection: ${response.error}` },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "KikoBooks connection status:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetConnectionStatusTool: ToolDefinition = {
    name: "get_connection_status",
    description:
        "Report whether the KikoBooks MCP server is connected to an organization. " +
        "Returns status (connected | unauthenticated | disconnected), whether credentials " +
        "are configured, and the API base URL. Never returns the API key or any token. " +
        "Call this first to confirm connectivity before other tools.",
    schema: toolSchema,
    handler: toolHandler,
};
