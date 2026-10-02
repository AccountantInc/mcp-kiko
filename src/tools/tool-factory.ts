import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";
import { getConfig } from "../config.js";

import { SearchTools } from "./search/index.js";
import { GetTools } from "./get/index.js";
import { CreateTools } from "./create/index.js";
import { UpdateTools } from "./update/index.js";
import { DeleteTools } from "./delete/index.js";
import { ActionTools } from "./action/index.js";
import { ReportTools } from "./reports/index.js";
import { BankingTools } from "./banking/index.js";
import { AdvancedTools } from "./advanced/index.js";
import { WriteTools } from "./write/index.js";

/** Mutating verb prefixes, grouped by the scope tier they require. */
const WRITE_PREFIXES = [
    "create_",
    "post_",
    "reverse_",
    "move_",
    "promote_",
    "send_",
    "generate_",
    "approve_",
    "copy_",
    "dispose_",
    "run_",
    "pause_",
    "resume_",
    "activate_",
    "start_",
    "complete_",
    "cancel_",
    "set_",
];
const UPDATE_PREFIXES = ["update_"];
const DELETE_PREFIXES = ["delete_", "void_"];

/**
 * True when a tool's scope tier is disabled via
 * KIKOBOOKS_DISABLE_WRITE/UPDATE/DELETE. Read tools always register.
 */
function isTierDisabled(name: string): boolean {
    const cfg = getConfig();
    const has = (prefixes: string[]) => prefixes.some((p) => name.startsWith(p));
    if (cfg.disableWrite && has(WRITE_PREFIXES)) return true;
    if (cfg.disableUpdate && has(UPDATE_PREFIXES)) return true;
    if (cfg.disableDelete && has(DELETE_PREFIXES)) return true;
    return false;
}

function registerTools(server: McpServer, tools: ToolDefinition[]) {
    tools.forEach((tool) => {
        if (isTierDisabled(tool.name)) return;
        server.tool(tool.name, tool.description, tool.schema, tool.handler);
    });
}

export function ToolFactory(server: McpServer) {
    registerTools(server, SearchTools);
    registerTools(server, GetTools);
    registerTools(server, CreateTools);
    registerTools(server, UpdateTools);
    registerTools(server, DeleteTools);
    registerTools(server, ActionTools);
    registerTools(server, ReportTools);
    registerTools(server, BankingTools);
    registerTools(server, AdvancedTools);
    registerTools(server, WriteTools);
}
