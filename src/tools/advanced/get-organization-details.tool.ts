import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({});

const handler = async () => {
    try {
        const res = await kikoBooksClient.get("/api/Organization/GetCurrentOrganization");
        return { content: [{ type: "text" as const, text: "Organization details:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error getting organization details: ${formatError(e)}` }] };
    }
};

export const GetOrganizationDetailsTool: ToolDefinition = {
    name: "get_organization_details",
    description:
        "Get the connected organization's profile — legal name, currency, fiscal settings, and enabled modules. Read-only.",
    schema,
    handler,
};
