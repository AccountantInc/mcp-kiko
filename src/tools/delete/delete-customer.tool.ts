import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { deleteKikoBooksCustomer } from "../../handlers/delete-kikobooks-customer.handler.js";

const toolSchema = z.object({
    customer_id: z.number().describe("The Customer ID to delete (soft delete — sets inactive)"),
});

const toolHandler = async (args: any) => {
    const response = await deleteKikoBooksCustomer(args.customer_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error deleting customer: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Customer deleted:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const DeleteCustomerTool: ToolDefinition = {
    name: "delete_customer",
    description:
        "Delete (deactivate) a customer in KikoBooks. This performs a soft delete by setting the customer as inactive.",
    schema: toolSchema,
    handler: toolHandler,
};
