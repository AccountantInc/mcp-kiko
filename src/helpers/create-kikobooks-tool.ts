import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";

export const CreateKikoBooksTool =
    <Args extends Record<string, any>>(
        name: string,
        description: string,
        schema: Args,
        handler: ToolCallback<Args>,
    ): (() => ToolDefinition) =>
        () => ({
            name,
            description,
            schema,
            handler,
        });
