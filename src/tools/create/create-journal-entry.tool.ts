import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksJournalEntry } from "../../handlers/create-kikobooks-journal-entry.handler.js";

const toolSchema = z.object({
    journalEntry: z.object({
        entryDate: z.string().describe("Entry date (YYYY-MM-DD)"),
        description: z.string().optional().describe("Entry description/memo"),
        lines: z
            .array(
                z.object({
                    accountId: z.number().describe("GL Account ID"),
                    description: z.string().optional().describe("Line description"),
                    debitAmount: z.number().optional().describe("Debit amount (use this OR creditAmount)"),
                    creditAmount: z.number().optional().describe("Credit amount (use this OR debitAmount)"),
                    costCenter: z.string().optional().describe("Cost center/department"),
                })
            )
            .describe("Journal entry lines — total debits must equal total credits"),
    }),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksJournalEntry(args.journalEntry);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error creating journal entry: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Journal entry created:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateJournalEntryTool: ToolDefinition = {
    name: "create_journal_entry",
    description:
        "Create a manual journal entry in KikoBooks. Requires entry date and debit/credit lines that balance. Once posted, entries are immutable — corrections require reversal entries.",
    schema: toolSchema,
    handler: toolHandler,
};
