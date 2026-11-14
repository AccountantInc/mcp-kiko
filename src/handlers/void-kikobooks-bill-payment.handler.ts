import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function voidKikoBooksBillPayment(
    paymentId: number,
    reason?: string
): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post(`/api/VendorPayments/${paymentId}/void`, {
            voidReason: reason?.trim() || "Voided via MCP",
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
