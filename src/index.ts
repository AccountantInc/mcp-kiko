#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KikoBooksMCPServer } from "./server/kikobooks-mcp-server.js";
import { ToolFactory } from "./tools/tool-factory.js";

const main = async () => {
    const server = KikoBooksMCPServer.GetServer();

    ToolFactory(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);
};

main().catch((error) => {
    console.error("Fatal error starting KikoBooks MCP Server:", error);
    process.exit(1);
});
