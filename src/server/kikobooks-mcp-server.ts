import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPackageVersion } from "../helpers/get-package-version.js";

export class KikoBooksMCPServer {
    private static instance: McpServer | null = null;

    public static GetServer(): McpServer {
        if (KikoBooksMCPServer.instance === null) {
            KikoBooksMCPServer.instance = new McpServer(
                {
                    name: "KikoBooks MCP Server",
                    version: getPackageVersion(),
                },
                {
                    capabilities: {
                        tools: {},
                    },
                }
            );
        }
        return KikoBooksMCPServer.instance;
    }
}
