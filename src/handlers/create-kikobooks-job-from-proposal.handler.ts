import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Create a job (with tasks) from an accepted proposal's line items — the
 * Proposal → Workflow bridge. POST /api/AC_SP_Proposal/createJobWithTasks.
 * Org_Id/UserId are resolved server-side (not part of the command), so they
 * are never sent here.
 */
export async function createKikoBooksJobFromProposal(body: {
    proposalId: number;
    jobName: string;
    optionId?: number;
    archive?: boolean;
    createTasksFromLines?: boolean;
    defaultTaskDueDays?: number;
}): Promise<ToolResponse<any>> {
    try {
        const response = await kikoBooksClient.post("/api/AC_SP_Proposal/createJobWithTasks", {
            PR_Proposal_Id: body.proposalId,
            JobName: body.jobName,
            OptionId: body.optionId,
            Archive: body.archive,
            CreateTasksFromLines: body.createTasksFromLines,
            DefaultTaskDueDays: body.defaultTaskDueDays,
        });
        return { result: response, isError: false, error: null };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
