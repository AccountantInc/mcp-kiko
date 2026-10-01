import { z } from "zod";
import { ToolDefinition } from "../../types/tool-definition.js";
import { createKikoBooksJobFromProposal } from "../../handlers/create-kikobooks-job-from-proposal.handler.js";

const toolSchema = z.object({
    proposal_id: z.number().describe("The accepted proposal ID to convert into a job"),
    job_name: z.string().describe("Name for the new job (required)"),
    option_id: z.number().optional().describe("Which proposal pricing option to use (default: first)"),
    archive: z.boolean().optional().describe("Archive the proposal after conversion"),
    create_tasks_from_lines: z.boolean().optional().describe("Create tasks from proposal lines (default: true)"),
    default_task_due_days: z.number().optional().describe("Default task due date, days from creation (default: 30)"),
});

const toolHandler = async (args: any) => {
    const response = await createKikoBooksJobFromProposal({
        proposalId: args.proposal_id,
        jobName: args.job_name,
        optionId: args.option_id,
        archive: args.archive,
        createTasksFromLines: args.create_tasks_from_lines,
        defaultTaskDueDays: args.default_task_due_days,
    });

    if (response.isError) {
        return {
            content: [{ type: "text" as const, text: `Error creating job from proposal: ${response.error}` }],
        };
    }

    return {
        content: [
            { type: "text" as const, text: "Job created from proposal:" },
            { type: "text" as const, text: JSON.stringify(response.result, null, 2) },
        ],
    };
};

export const CreateJobFromProposalTool: ToolDefinition = {
    name: "create_job_from_proposal",
    description:
        "Create a job (with tasks) from an accepted proposal's line items — the Proposal → Workflow bridge. " +
        "Requires proposal_id and job_name. Requires the Sales and Workflow modules and the write scope. " +
        "Confirm the proposal and job name with the user before calling, then verify with search_jobs.",
    schema: toolSchema,
    handler: toolHandler,
};
