import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksLead } from "../../handlers/create-kikobooks-lead.handler.js";

const toolSchema = z.object({
    lead: z.object({
        firstName: z.string().describe("Lead first name (required)"),
        lastName: z.string().describe("Lead last name (required)"),
        companyName: z.string().optional().describe("Company name"),
        email: z.string().optional().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        website: z.string().optional().describe("Website"),
        title: z.string().optional().describe("Job title"),
        notes: z.string().optional().describe("Free-text notes"),
        leadStatus: z.string().optional().describe("Lead status (defaults to 'New')"),
        leadScore: z.number().optional().describe("Lead score (0-100)"),
        leadSourceId: z.number().optional().describe("Lead source lookup ID"),
        customerId: z.number().optional().describe("Linked AR customer ID, if any"),
        tagIds: z.array(z.number()).optional().describe("Tag IDs to attach"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksLead(args.lead);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating lead: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Lead created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateLeadTool: ToolDefinition = {
    name: "create_lead",
    description:
        "Create a new CRM lead. Requires first and last name; optionally include company, contact details, " +
        "status, score, source, and tags. Requires the Sales module and the write scope. " +
        "Preview the details and confirm with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
