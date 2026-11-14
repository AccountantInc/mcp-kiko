import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

export async function createKikoBooksJournalEntry(entryData: any): Promise<ToolResponse<any>> {
    try {
        const rawLines = Array.isArray(entryData?.lines ?? entryData?.Lines)
            ? (entryData.lines ?? entryData.Lines)
            : [];
        const lines = rawLines.map((line: any, index: number) => ({
            lineNumber: line?.lineNumber ?? index + 1,
            gl_Account_Id:
                line?.gl_Account_Id ??
                line?.GL_Account_Id ??
                line?.accountId,
            debit: line?.debit ?? line?.Debit ?? line?.debitAmount ?? 0,
            credit: line?.credit ?? line?.Credit ?? line?.creditAmount ?? 0,
            description: line?.description ?? line?.Description,
            memo: line?.memo ?? line?.Memo ?? line?.costCenter,
        }));
        const payload = {
            entryDate: entryData?.entryDate ?? entryData?.EntryDate,
            description:
                entryData?.description ?? entryData?.Description ?? "Manual journal entry",
            autoPost: entryData?.autoPost ?? entryData?.AutoPost ?? false,
            lines,
        };
        const response = await kikoBooksClient.post("/api/GeneralLedger/journal-entries", payload);
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
