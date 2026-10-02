import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { kikoBooksClient } from "../../clients/kikobooks-client.js";
import { formatError } from "../../helpers/format-error.js";

// Mirrors SaveDepositLineDto
const lineSchema = z.object({
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

// Mirrors SaveDepositDto
const schema = z.object({
    depositDate: z.string().describe("Deposit date (YYYY-MM-DD)"),
    bank_Account_Id: z.number().describe("Destination Bank_Account_Id"),
    depositToGL_Account_Id: z.number().describe("Destination GL cash account id"),
    depositDescription: z.string().optional().describe("Deposit description"),
    currencyCode: z.string().optional().describe("ISO currency code"),
    bank_TransactionNormalized_Id: z.number().optional().describe("Linked normalized bank transaction id"),
    cashBackAmount: z.number().optional().describe("Cash-back amount withheld"),
    cashBackAccount_Id: z.number().optional().describe("GL account id for cash back"),
    cashBackMemo: z.string().optional().describe("Cash-back memo"),
    lines: z.array(lineSchema).describe("Deposit lines (the payments/receipts being deposited)"),
});

const handler = async (args: any) => {
    try {
        const res = await kikoBooksClient.post("/api/Deposits", args);
        return { content: [{ type: "text" as const, text: "Deposit created:" }, { type: "text" as const, text: JSON.stringify(res, null, 2) }] };
    } catch (e) {
        return { content: [{ type: "text" as const, text: `Error creating deposit: ${formatError(e)}` }] };
    }
};

export const CreateDepositTool: ToolDefinition = {
    name: "create_deposit",
    description:
        "Create a bank deposit from undeposited payments/receipts (DR Bank, CR Undeposited Funds on posting). Created as a DRAFT; use post_deposit to post it. Preview and confirm with the user before calling.",
    schema,
    handler,
};
