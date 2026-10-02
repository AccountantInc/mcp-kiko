import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

const lineSchema = z.object({
    aR_DepositLine_Id: z.number().optional().describe("Existing line id (omit for new lines)"),
    lineType: z.string().describe("Line type (e.g. Payment, SalesReceipt, Other)"),
    amount: z.number().describe("Line amount"),
    aR_Payment_Id: z.number().optional().describe("AR_Payment_Id when LineType=Payment"),
    aR_SalesReceipt_Id: z.number().optional().describe("AR_SalesReceipt_Id when LineType=SalesReceipt"),
    otherSourceType: z.string().optional().describe("Free-text source type for Other lines"),
    otherSourceId: z.number().optional().describe("Source id for Other lines"),
    customer_Id: z.number().optional().describe("Customer_Id for the line"),
    currencyCode: z.string().optional().describe("ISO currency code"),
    description: z.string().optional().describe("Line description"),
});

const schema = z.object({
    id: z.number().describe("Deposit ID to update (DRAFT only)"),
    depositDate: z.string().describe("Deposit date (YYYY-MM-DD)"),
    bank_Account_Id: z.number().describe("Destination Bank_Account_Id"),
    depositToGL_Account_Id: z.number().describe("Destination GL cash account id"),
    depositDescription: z.string().optional().describe("Deposit description"),
    currencyCode: z.string().optional().describe("ISO currency code"),
    cashBackAmount: z.number().optional().describe("Cash-back amount withheld"),
    cashBackAccount_Id: z.number().optional().describe("GL account id for cash back"),
    cashBackMemo: z.string().optional().describe("Cash-back memo"),
    lines: z.array(lineSchema).describe("Deposit lines"),
});

const handler = async (args: any) => {
    try {
        const { id, ...body } = args;
        const res = await kikoBooksClient.put(`/api/Deposits/${id}`, body);
        return { content: [{ type: "text" as const, text: "Deposit updated:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error updating deposit: ${formatError(e)}` }] };
    }
};

export const UpdateDepositTool: ToolDefinition = {
    name: "update_deposit",
    description: "Update a DRAFT bank deposit. Posted deposits cannot be edited. Preview and confirm with the user first.",
    schema,
    handler,
};
