import { PostJournalEntryTool } from "./post-journal-entry.tool.js";
import { ReverseJournalEntryTool } from "./reverse-journal-entry.tool.js";
import { VoidBillPaymentTool } from "./void-bill-payment.tool.js";
import { VoidBillTool } from "./void-bill.tool.js";
import { MoveDealStageTool } from "./move-deal-stage.tool.js";
import { PromoteDealToCustomerTool } from "./promote-deal-to-customer.tool.js";
import { GenerateInvoiceFromProposalTool } from "./generate-invoice-from-proposal.tool.js";
import { GenerateInvoiceFromJobTool } from "./generate-invoice-from-job.tool.js";

export const ActionTools = [
    PostJournalEntryTool,
    ReverseJournalEntryTool,
    VoidBillPaymentTool,
    VoidBillTool,
    MoveDealStageTool,
    PromoteDealToCustomerTool,
    GenerateInvoiceFromProposalTool,
    GenerateInvoiceFromJobTool,
];
