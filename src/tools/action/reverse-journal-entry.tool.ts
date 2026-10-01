import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { reverseKikoBooksJournalEntry } from "../../handlers/reverse-kikobooks-journal-entry.handler.js";

const toolSchema = z.object({
    entry_id: z.number().describe("The Journal Entry ID to reverse"),
    reversal_date: z.string().optional().describe("Date for the reversal entry (YYYY-MM-DD). Defaults to original entry date."),
});

const toolHandler = async (args: any) => {
    const response = await reverseKikoBooksJournalEntry(args.entry_id, args.reversal_date);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error reversing journal entry: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Journal entry reversed:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const ReverseJournalEntryTool: ToolDefinition = {
    name: "reverse_journal_entry",
    description:
        "Reverse a posted journal entry in KikoBooks. Creates a new entry with opposite debits/credits. Posted entries cannot be deleted — only reversed.",
    schema: toolSchema,
    handler: toolHandler,
};
