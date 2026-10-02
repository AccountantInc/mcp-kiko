# KikoBooks MCP Server — Roadmap & Architecture Plan

## What Is This?

A **TypeScript Model Context Protocol (MCP) server** that lets AI assistants (Claude Desktop, VS Code Copilot, OpenAI agents, etc.) interact with **KikoBooks** — your bookkeeping SaaS — through natural language.

It gives AI agents the ability to search, create, update, and manage your accounting data — accounts, invoices, bills, journal entries, payments, and more — all through a standardized MCP interface.

This is **your public/external MCP server** for third-party AI integrations.

> **Status (shipped):** Public repo, MIT-licensed, published to npm as
> **`@agentkiko/kikobooks-mcp-server`** (latest `0.2.1`) and installable via
> `npx -y @agentkiko/kikobooks-mcp-server`. Production API base URL is
> **`https://ai.kikobooks.com`**. Phases 1 + 1.5 + read-only slices of Phases 2–4
> are complete (116 tools); the remaining create-with-nested-template and per-transaction bank match/categorize tools are the forward roadmap.

> **Note:** KikoBooks already has an **internal** .NET MCP server (`KikoBooks.McpServer`) that connects directly to the database via Dapper/MediatR. This new TypeScript server is different — it calls the **KikoBooks REST API** over HTTP, making it safe for external distribution.

---

## Should The Repo Be Public?

**Yes, make it public.** Here's why:

| Reason | Detail |
|--------|--------|
| **Discoverability** | MCP servers are listed on directories like [glama.ai](https://glama.ai/mcp/servers), [smithery.ai](https://smithery.ai/) — they require public repos |
| **Trust** | Users want to inspect what an MCP server does before granting it API access |
| **NPX distribution** | `npx @agentkiko/kikobooks-mcp-server` requires a public npm package backed by public source |
| **Industry standard** | MCP servers for accounting platforms are public MIT-licensed repos |
| **No secrets exposed** | The server contains zero secrets — all credentials come from environment variables at runtime |

**Recommendation:** Public repo, MIT license, `.env` in `.gitignore`. **(Done — shipped.)**

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AI Assistant                          │
│         (Claude Desktop / VS Code / OpenAI)             │
└──────────────────────┬──────────────────────────────────┘
                       │ MCP Protocol (STDIO)
                       ▼
┌─────────────────────────────────────────────────────────┐
│               KikoBooks MCP Server                      │
│                  (TypeScript)                            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Tools   │→ │ Handlers │→ │  KikoBooks API Client │  │
│  │ (Schema) │  │ (Logic)  │  │  (HTTP + JWT Auth)    │  │
│  └──────────┘  └──────────┘  └──────────┬────────────┘  │
└──────────────────────────────────────────┼──────────────┘
                                           │ HTTPS REST
                                           ▼
                              ┌─────────────────────────┐
                              │   KikoBooks API Server   │
                              │   (.NET 10 / Azure)      │
                              │   JWT Bearer Auth        │
                              │   Multi-tenant (Org_Id)  │
                              └─────────────────────────┘
```

### Pattern

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Tool** | Zod schema + metadata + handler glue | `search-invoices.tool.ts` |
| **Handler** | Business logic, calls client, formats response | `search-kikobooks-invoices.handler.ts` |
| **Client** | HTTP requests, JWT auth, token refresh | `kikobooks-client.ts` |
| **Types** | Shared TypeScript types | `tool-definition.ts`, `tool-response.ts` |
| **Helpers** | Tool registration, error formatting | `register-tool.ts`, `format-error.ts` |
| **Server** | MCP server singleton | `kikobooks-mcp-server.ts` |

### Tool-authoring rules (learned the hard way)

- **Schema registration.** Tools declare `schema: z.object({...})`, but the MCP SDK's
  `server.tool(name, desc, paramsSchema, cb)` wants a **ZodRawShape** (`{ field: zodType }`).
  `tool-factory.ts` unwraps to `.shape` centrally — passing the `ZodObject` directly emits an
  **empty** input schema (agents see no params). Guarded by `scripts/verify-tools.mjs`
  (`input schema exposes params`) and `scripts/schema-check.mjs`.
- **Request-body casing.** The KikoBooks API uses **Newtonsoft.Json** with a
  `CamelCasePropertyNamesContractResolver` and case-insensitive deserialization. Field casing
  doesn't matter, but **underscores must match the C# DTO** (`Bank_Account_Id` → `bank_Account_Id`,
  not `bankAccountId`). Model every write body against the real `Save*Dto`.
- **Honest failure.** Only expose a tool that maps to a real endpoint + DTO. No balance-sheet
  endpoint → no `get_balance_sheet`. Large nested create templates → deferred, not faked.
- **Scope tiers.** New mutating verbs must be added to `WRITE_PREFIXES`/`UPDATE_PREFIXES`/
  `DELETE_PREFIXES` so the `KIKOBOOKS_DISABLE_*` client flags hide them; the server's `api_scope`
  middleware is the authoritative control regardless.

---

## Entity & Tool Inventory

### Phase 1 — Core Bookkeeping ✅ (50 tools — COMPLETE)
*All bookkeeping tools an AI agent needs.*

| Entity | Tools | KikoBooks API Endpoints |
|--------|-------|------------------------|
| **Chart of Accounts** | `search_accounts`, `get_account`, `create_account`, `update_account` | `/api/GL/Accounts` |
| **Customers** | `search_customers`, `get_customer`, `create_customer`, `update_customer`, `delete_customer` | `/api/Customers` |
| **Invoices** | `search_invoices`, `get_invoice`, `create_invoice`, `update_invoice` | `/api/Invoices` |
| **Items** | `search_items`, `get_item`, `create_item`, `update_item` | `/api/Items` |
| **Vendors** | `search_vendors`, `get_vendor`, `create_vendor`, `update_vendor`, `delete_vendor` | `/api/Vendors` |
| **Bills** | `search_bills`, `get_bill`, `create_bill`, `update_bill`, `void_bill` | `/api/Bills` |
| **Journal Entries** | `search_journal_entries`, `get_journal_entry`, `create_journal_entry`, `post_journal_entry`, `reverse_journal_entry` | `/api/GeneralLedger/journal-entries` |
| **Bill Payments** | `search_bill_payments`, `get_bill_payment`, `create_bill_payment`, `void_bill_payment` | `/api/VendorPayments` |
| **Purchases/Expenses** | `search_purchases`, `get_purchase`, `create_purchase`, `update_purchase`, `delete_purchase` | `/api/Expenses` |
| **Customer Payments** | `search_payments`, `get_payment`, `create_payment` | `/api/Payments` |
| **Credit Memos** | `search_credit_memos`, `get_credit_memo`, `create_credit_memo` | `/api/CreditMemos` |
| **Sales Receipts** | `search_sales_receipts`, `get_sales_receipt`, `create_sales_receipt` | `/api/SalesReceipts` |

**Phase 1 Total: 50 tools across 12 entities**

### Phase 1.5 — Practice Management ✅ (COMPLETE)
*CRM, Proposals, and Workflow, with lifecycle bridges. Capability-gated:
these require the org's Sales / Workflow modules (always on for accounting
firms; opt-in for self-service businesses) — agents call `get_enabled_modules`
first.*

| Area | Tools | KikoBooks API Endpoints |
|------|-------|------------------------|
| **CRM** | `search_leads`, `get_lead`, `create_lead`, `search_deals`, `get_deal`, `create_deal`, `update_deal`, `get_pipeline`, `move_deal_stage`, `promote_deal_to_customer` | `/api/Crm/*` |
| **Proposals** | `search_proposals`, `get_proposal`, `copy_proposal`, `generate_invoice_from_proposal`, `create_job_from_proposal` | `/api/AC_SP_Proposal/*` |
| **Workflow** | `search_jobs`, `get_job`, `list_job_tasks`, `update_job_status`, `update_task_status`, `generate_invoice_from_job` | `/api/AC_SP_Jobs/*`, `/api/AC_SP_Job_Tasks/*` |
| **Connection & discovery** | `get_connection_status`, `get_enabled_modules` | `/api/AuthorizationBackbone/runtime` |

**Lifecycle bridges:** CRM deal → proposal → job → invoice, end to end.
**Running total: 73 tools.**

### Phase 2–4 — Read-only slices ✅ (COMPLETE — 23 tools)
*Agent-facing reads across reporting, banking, and advanced modules. Write/action
tools for these modules remain on the forward roadmap below.*

| Area | Tools |
|------|-------|
| **Reports** | `get_trial_balance`, `get_profit_and_loss`, `get_ar_aging`, `get_ap_aging`, `get_cash_position`, `get_expense_by_category`, `get_income_by_category`, `get_business_health` |
| **Banking** | `search_bank_accounts`, `get_bank_account`, `search_bank_transactions`, `get_bank_transaction`, `search_reconciliation_sessions`, `get_reconciliation_summary` |
| **Deposits / Fixed Assets / Recurring / Statements / Org** | `search_deposits`, `get_deposit`, `search_fixed_assets`, `get_fixed_asset`, `search_recurring_schedules`, `get_recurring_schedule`, `search_statements`, `get_statement`, `get_organization_details` |

**Running total: 96 tools.** (No `get_balance_sheet` — the API has no balance-sheet endpoint yet; omitted rather than faked.)

### Phase 2–4 — Write/action slice ✅ (COMPLETE — 20 tools)
*Workflow and lifecycle writes. Mutating — gated by the read-write API-key scope and the
`KIKOBOOKS_DISABLE_WRITE` client flag.*

| Area | Tools |
|------|-------|
| **Deposits** | `create_deposit`, `update_deposit`, `delete_deposit`, `void_deposit`, `post_deposit` |
| **Fixed Assets** | `create_fixed_asset`, `update_fixed_asset`, `dispose_fixed_asset`, `run_depreciation` |
| **Recurring** | `delete_recurring_schedule`, `pause_recurring_schedule`, `resume_recurring_schedule`, `activate_recurring_schedule`, `generate_recurring_invoice` |
| **Statements** | `delete_statement`, `send_statement` |
| **Reconciliation** | `start_reconciliation`, `complete_reconciliation`, `cancel_reconciliation`, `set_statement_balance` |

**Running total: 116 tools.**

**Deferred (intentional):** `create_recurring_schedule`, `create_statement`, and the
per-bank-transaction match/categorize/record-transfer tools. Their request bodies are
large nested templates (bill-to/ship-to/line arrays, cross-module matching) that warrant
dedicated design rather than a best-effort mapping — omitted rather than faked.

### Phase 2 — Banking & Reconciliation (planned)

| Entity | Tools |
|--------|-------|
| **Bank Accounts** | `search_bank_accounts`, `get_bank_account` |
| **Bank Transactions** | `search_bank_transactions`, `get_bank_transaction` |
| **Reconciliation** | `get_reconciliation_status` |

### Phase 3 — Reports & Analytics (planned)

| Entity | Tools |
|--------|-------|
| **Profit & Loss** | `get_profit_and_loss` |
| **Balance Sheet** | `get_balance_sheet` |
| **Trial Balance** | `get_trial_balance` |
| **AR Aging** | `get_ar_aging` |
| **AP Aging** | `get_ap_aging` |
| **Dashboard** | `get_insights_dashboard` |

### Phase 4 — Advanced Features (planned)

| Entity | Tools |
|--------|-------|
| **Deposits** | `search_deposits`, `create_deposit` |
| **Fixed Assets** | `search_fixed_assets`, `get_fixed_asset` |
| **Recurring Invoices** | `search_recurring_invoices` |
| **Recurring Bills** | `search_recurring_bills` |
| **Organization** | `get_organization_details` |

---

## Authentication Strategy

### For the MCP Server → KikoBooks API

```
AI Client → MCP Server → KikoBooks API
                 │
                 ├── Option 1: API Key (simplest)
                 │   KIKOBOOKS_API_KEY=xxx
                 │   Exchanges for JWT token automatically
                 │
                 ├── Option 2: Direct JWT Token
                 │   KIKOBOOKS_ACCESS_TOKEN=xxx
                 │   KIKOBOOKS_REFRESH_TOKEN=xxx
                 │
                 └── Option 3: Username/Password (dev only)
                     KIKOBOOKS_EMAIL=user@example.com
                     KIKOBOOKS_PASSWORD=xxx
```

### Environment Variables

```env
# Required
KIKOBOOKS_BASE_URL=https://ai.kikobooks.com
KIKOBOOKS_API_KEY=your_api_key_here

# The API key's scope (Read-only or Read & write) is chosen in the KikoBooks UI
# when the key is generated. A Read-only key returns HTTP 403 on any write.

# Or manual token management
KIKOBOOKS_ACCESS_TOKEN=your_jwt_token
KIKOBOOKS_REFRESH_TOKEN=your_refresh_token

# Optional
KIKOBOOKS_ENVIRONMENT=sandbox   # sandbox | production
```

---

## Project Structure

```
kikobooks-mcp-server/
├── .env.example
├── .gitignore
├── LICENSE                    # MIT
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Entry point
│   ├── clients/
│   │   ├── kikobooks-client.ts    # HTTP client + JWT auth
│   │   └── GETTING_STARTED.md
│   ├── server/
│   │   └── kikobooks-mcp-server.ts # MCP server singleton
│   ├── tools/
│   │   ├── search-accounts.tool.ts
│   │   ├── get-account.tool.ts
│   │   ├── create-account.tool.ts
│   │   ├── update-account.tool.ts
│   │   ├── search-customers.tool.ts
│   │   ├── ... (one file per tool, 50 total)
│   │   └── create-sales-receipt.tool.ts
│   ├── handlers/
│   │   ├── search-kikobooks-accounts.handler.ts
│   │   ├── get-kikobooks-account.handler.ts
│   │   ├── ... (one file per handler, 50 total)
│   │   └── create-kikobooks-sales-receipt.handler.ts
│   ├── helpers/
│   │   ├── register-tool.ts
│   │   └── format-error.ts
│   └── types/
│       ├── tool-definition.ts
│       └── tool-response.ts
└── _Reference/               # Reference implementations
    └── ...
```

---

## Claude Desktop / VS Code Configuration

Users configure it like this:

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "kikobooks": {
      "command": "npx",
      "args": ["-y", "@agentkiko/kikobooks-mcp-server@latest"],
      "env": {
        "KIKOBOOKS_BASE_URL": "https://ai.kikobooks.com",
        "KIKOBOOKS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### VS Code (`.vscode/mcp.json`)
```json
{
  "servers": {
    "kikobooks": {
      "command": "npx",
      "args": ["-y", "@agentkiko/kikobooks-mcp-server@latest"],
      "env": {
        "KIKOBOOKS_BASE_URL": "https://ai.kikobooks.com",
        "KIKOBOOKS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

## Implementation Timeline

| Phase | Scope | Tools |
|-------|-------|-------|
| **Phase 0** ✅ | Project scaffold, client, auth, server setup | 0 |
| **Phase 1** ✅ | Core Bookkeeping (12 entities: Accounts, Customers, Vendors, Items, Invoices, Bills, Journal Entries, Bill Payments, Purchases, Payments, Credit Memos, Sales Receipts) | 50 |
| **Phase 1.5** ✅ | Practice Management (CRM, Proposals, Workflow) + lifecycle bridges + capability/connection tools | 23 |
| **Phase 2** | Banking (Bank Accounts, Transactions, Reconciliation) | TBD |
| **Phase 3** | Reports (P&L, Balance Sheet, Trial Balance, Aging) | TBD |
| **Phase 4** | Advanced (Fixed Assets, Recurring, Org Details) | TBD |

---

## Key Differences from Internal MCP Server

| Feature | Internal (.NET) | External (TypeScript) |
|---------|----------------|----------------------|
| **Access** | Direct DB (Dapper/EF Core) | REST API (HTTP) |
| **Auth** | McpAuthContext (config-based) | JWT Bearer tokens |
| **Distribution** | Part of KikoBooks solution | Standalone npm package |
| **Users** | HT developers only | Any KikoBooks customer |
| **Write approval** | AI_Suggestion tiers | Deferred to API server |
| **Transport** | STDIO (VS Code) | STDIO (any MCP client) |

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.8+
- **MCP SDK:** `@modelcontextprotocol/sdk` (latest)
- **Validation:** Zod 3.x
- **HTTP:** Built-in `fetch` (Node 18+)
- **Auth:** JWT token management
- **Build:** `tsc` → ESM modules

---

## Next Steps

1. ✅ Analyze reference implementations
2. ✅ Analyze KikoBooks API structure
3. ✅ Create this roadmap
4. ✅ Scaffold Phase 0 (project setup, client, server, types, helpers)
5. ✅ Implement Phase 1 tools (50 tools for core bookkeeping)
6. 🔲 Test with Claude Desktop / VS Code
7. 🔲 Publish to npm as `@agentkiko/kikobooks-mcp-server`
8. 🔲 Submit to MCP server directories
