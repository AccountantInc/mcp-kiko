import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { promoteKikoBooksDealToCustomer } from "../../handlers/promote-kikobooks-deal-to-customer.handler.js";

const toolSchema = z.object({
    deal_id: z.number().describe("The CRM deal ID whose customer should be promoted"),
});

const toolHandler = async (args: any) => {
    const response = await promoteKikoBooksDealToCustomer(args.deal_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error promoting deal to customer: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Deal promoted to customer:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const PromoteDealToCustomerTool: ToolDefinition = {
    name: "promote_deal_to_customer",
    description:
        "Promote a deal's customer to the 'Customer' lifecycle stage and link it to the deal. " +
        "This is the required gate before creating a proposal or job from a deal. " +
        "Requires the Sales module and the write scope. Confirm with the user before calling.",
    schema: toolSchema,
    handler: toolHandler,
};
