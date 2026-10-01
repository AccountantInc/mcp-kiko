import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksInvoice } from "../../handlers/create-kikobooks-invoice.handler.js";

const toolSchema = z.object({
    invoice: z.object({
        customerId: z.number().describe("Customer ID for this invoice"),
        invoiceDate: z.string().describe("Invoice date (YYYY-MM-DD)"),
        dueDate: z.string().describe("Due date (YYYY-MM-DD)"),
        termsCode: z.string().optional().describe("Payment terms code"),
        currencyCode: z.string().optional().describe("Currency code (e.g., 'USD')"),
        lineItems: z
            .array(
                z.object({
                    description: z.string().describe("Line item description"),
                    quantity: z.number().describe("Quantity"),
                    unitPrice: z.number().describe("Unit price"),
                    itemId: z.number().optional().describe("Item/product ID"),
                    accountId: z.number().optional().describe("GL Account ID for revenue"),
                    taxCode: z.string().optional().describe("Tax code"),
                })
            )
            .describe("Invoice line items"),
        memo: z.string().optional().describe("Internal memo"),
        billingAddressLine1: z.string().optional(),
        billingAddressCity: z.string().optional(),
        billingAddressState: z.string().optional(),
        billingAddressPostalCode: z.string().optional(),
        billingAddressCountry: z.string().optional(),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksInvoice(args.invoice);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating invoice: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Invoice created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateInvoiceTool: ToolDefinition = {
    name: "create_invoice",
    description:
        "Create a new invoice in KikoBooks. Requires customer ID, dates, and at least one line item with description, quantity, and unit price.",
    schema: toolSchema,
    handler: toolHandler,
};
