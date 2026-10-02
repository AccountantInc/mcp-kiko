import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const schema = z.object({
    id: z.number().describe("Statement ID to send"),
    deliveryMethod: z.string().optional().describe("Delivery method (e.g. Email)"),
    recipientEmail: z.string().optional().describe("Override recipient email address"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post(`/api/Statements/${args.id}/send`, {
            deliveryMethod: args.deliveryMethod,
            recipientEmail: args.recipientEmail,
        });
        return { content: [{ type: "text" as const, text: "Statement sent:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error sending statement: ${formatError(e)}` }] };
    }
};

export const SendStatementTool: ToolDefinition = {
    name: "send_statement",
    description:
        "Send a customer statement to the customer (email). Show the recipient to the user and confirm before sending.",
    schema,
    handler,
};
