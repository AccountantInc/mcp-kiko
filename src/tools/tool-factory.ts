import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";

import { SearchTools } from "./search/index.js";
import { GetTools } from "./get/index.js";
import { CreateTools } from "./create/index.js";
import { UpdateTools } from "./update/index.js";
import { DeleteTools } from "./delete/index.js";
import { ActionTools } from "./action/index.js";

function registerTools(server: McpServer, tools: ToolDefinition[]) {
    tools.forEach((tool) =>
        server.tool(tool.name, tool.description, tool.schema, tool.handler),
    );
}

export function ToolFactory(server: McpServer) {
    registerTools(server, SearchTools);
    registerTools(server, GetTools);
    registerTools(server, CreateTools);
    registerTools(server, UpdateTools);
    registerTools(server, DeleteTools);
    registerTools(server, ActionTools);
}
