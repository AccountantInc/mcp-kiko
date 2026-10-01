import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface ToolDefinition {
    name: string;
    description: string;
    schema: Record<string, any>;
    handler: ToolCallback<Record<string, any>>;
}
