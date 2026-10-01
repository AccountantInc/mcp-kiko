import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksCustomer } from "../../handlers/get-kikobooks-customer.handler.js";

const toolSchema = z.object({
    customer_id: z.number().describe("The Customer ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksCustomer(args.customer_id);

    if (response.isError) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error getting customer: ${response.error}`,
                },
            ],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Customer details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetCustomerTool: ToolDefinition = {
    name: "get_customer",
    description:
        "Get a single customer by ID from KikoBooks. Returns full customer details including contact info, addresses, and balance.",
    schema: toolSchema,
    handler: toolHandler,
};
