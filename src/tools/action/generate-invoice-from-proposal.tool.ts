import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { generateKikoBooksInvoiceFromProposal } from "../../handlers/generate-kikobooks-invoice-from-proposal.handler.js";

const toolSchema = z.object({
    proposal_id: z.number().describe("The signed/contracted proposal ID to invoice"),
    invoice_date: z.string().optional().describe("Invoice date (YYYY-MM-DD); defaults to today if omitted"),
    due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
    terms_code: z.string().optional().describe("Payment terms code"),
    gl_ar_account_id: z.number().optional().describe("Override AR GL account ID"),
    default_revenue_gl_account_id: z.number().optional().describe("Default revenue GL account ID for lines"),
});

const toolHandler = async (args: any) => {
    const response = await generateKikoBooksInvoiceFromProposal(args.proposal_id, {
        invoiceDate: args.invoice_date,
        dueDate: args.due_date,
        termsCode: args.terms_code,
        glArAccountId: args.gl_ar_account_id,
        defaultRevenueGlAccountId: args.default_revenue_gl_account_id,
    });

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error generating invoice from proposal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Draft invoice generated from proposal:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GenerateInvoiceFromProposalTool: ToolDefinition = {
    name: "generate_invoice_from_proposal",
    description:
        "Generate a DRAFT AR invoice from a signed/contracted proposal — the Proposal → invoice bridge. " +
        "Maps the selected pricing option's line items onto a new draft invoice (does not post to GL). " +
        "Requires the Sales module and the write scope. Confirm the proposal and terms with the user before calling, " +
        "then verify the created invoice with search_invoices or get_invoice.",
    schema: toolSchema,
    handler: toolHandler,
};
