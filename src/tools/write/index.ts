import { CreateDepositTool } from "./create-deposit.tool.js";
import { UpdateDepositTool } from "./update-deposit.tool.js";
import { DeleteDepositTool } from "./delete-deposit.tool.js";
import { VoidDepositTool } from "./void-deposit.tool.js";
import { PostDepositTool } from "./post-deposit.tool.js";
import { CreateFixedAssetTool } from "./create-fixed-asset.tool.js";
import { UpdateFixedAssetTool } from "./update-fixed-asset.tool.js";
import { DisposeFixedAssetTool } from "./dispose-fixed-asset.tool.js";
import { RunDepreciationTool } from "./run-depreciation.tool.js";
import { DeleteRecurringScheduleTool } from "./delete-recurring-schedule.tool.js";
import { PauseRecurringScheduleTool } from "./pause-recurring-schedule.tool.js";
import { ResumeRecurringScheduleTool } from "./resume-recurring-schedule.tool.js";
import { ActivateRecurringScheduleTool } from "./activate-recurring-schedule.tool.js";
import { GenerateRecurringInvoiceTool } from "./generate-recurring-invoice.tool.js";
import { DeleteStatementTool } from "./delete-statement.tool.js";
import { SendStatementTool } from "./send-statement.tool.js";
import { StartReconciliationTool } from "./start-reconciliation.tool.js";
import { CompleteReconciliationTool } from "./complete-reconciliation.tool.js";
import { CancelReconciliationTool } from "./cancel-reconciliation.tool.js";
import { SetStatementBalanceTool } from "./set-statement-balance.tool.js";

export const WriteTools = [
    CreateDepositTool,
    UpdateDepositTool,
    DeleteDepositTool,
    VoidDepositTool,
    PostDepositTool,
    CreateFixedAssetTool,
    UpdateFixedAssetTool,
    DisposeFixedAssetTool,
    RunDepreciationTool,
    DeleteRecurringScheduleTool,
    PauseRecurringScheduleTool,
    ResumeRecurringScheduleTool,
    ActivateRecurringScheduleTool,
    GenerateRecurringInvoiceTool,
    DeleteStatementTool,
    SendStatementTool,
    StartReconciliationTool,
    CompleteReconciliationTool,
    CancelReconciliationTool,
    SetStatementBalanceTool,
];
