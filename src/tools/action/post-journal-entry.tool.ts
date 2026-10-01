import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { postKikoBooksJournalEntry } from "../../handlers/post-kikobooks-journal-entry.handler.js";

const toolSchema = z.object({
    entry_id: z.number().describe("The Journal Entry ID to post to the general ledger"),
});

const toolHandler = async (args: any) => {
    const response = await postKikoBooksJournalEntry(args.entry_id);

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error posting journal entry: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Journal entry posted:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const PostJournalEntryTool: ToolDefinition = {
    name: "post_journal_entry",
    description:
        "Post a journal entry to the general ledger in KikoBooks. Once posted, the entry becomes immutable and affects account balances.",
    schema: toolSchema,
    handler: toolHandler,
};
