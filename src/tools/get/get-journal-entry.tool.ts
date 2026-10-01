import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { getKikoBooksJournalEntry } from "../../handlers/get-kikobooks-journal-entry.handler.js";

const toolSchema = z.object({
    entry_id: z.number().describe("The Journal Entry ID to retrieve"),
});

const toolHandler = async (args: any) => {
    const response = await getKikoBooksJournalEntry(args.entry_id);
    if (response.isError) {
        return { content: [{ type: "text" as const, text: `Error getting journal entry: ${response.error}` }] };
    }
    return {
        content: [
            { type: "text" as const, text: "Journal Entry details:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const GetJournalEntryTool: ToolDefinition = {
    name: "get_journal_entry",
    description:
        "Get a single journal entry by ID from KikoBooks. Returns full entry details including debit/credit lines, posting status, and audit hash.",
    schema: toolSchema,
    handler: toolHandler,
};
