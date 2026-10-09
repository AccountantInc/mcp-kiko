# KikoBooks MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [KikoBooks](https://kikobooks.com) — enterprise AI-agentic bookkeeping software. This server enables AI assistants like Claude, GitHub Copilot, and OpenAI-powered agents to interact with your KikoBooks accounting data through natural language.

> **Building an agent on top of this server?** Read [SKILL.md](SKILL.md) — the operating guide (status-first connect, write-tier approval, read-back verification, never expose secrets).

## Features

- **Chart of Accounts** — Search, get, create, and update GL accounts
- **Customers** — Full CRUD with soft delete for customer management
- **Invoices** — Search, create, and manage AR invoices
- **Items** — Manage products and services
- **Vendors** — Full CRUD with soft delete for vendor management
- **Bills** — Full CRUD with void for AP bills
- **Journal Entries** — Search, create, post, and reverse GL journal entries
- **Bill Payments** — Search, create, and void AP payments
- **Purchases / Expenses** — Full CRUD with delete for expense transactions
- **Customer Payments** — Search, create, and manage AR payments
- **Credit Memos** — Search, create, and manage AR credit memos
- **Sales Receipts** — Search, create, and manage sales receipts
- **CRM** — Leads, deals, and pipeline (search/create/update), plus stage moves and customer promotion
- **Proposals** — Search and copy proposals; convert accepted proposals to invoices or jobs
- **Workflow** — Jobs (Projects/Engagements) and tasks; status updates and job-to-invoice billing
- **Lifecycle bridges** — CRM deal → proposal → job → invoice, end to end
- **Reports** — Trial balance, profit & loss, AR/AP aging, cash position, income/expense by category, business health (read-only)
- **Banking** — Bank accounts, imported transactions, and reconciliation sessions, plus the reconciliation lifecycle (start, set statement balance, complete, cancel)
- **Deposits, Fixed Assets, Recurring Schedules, Statements** — Search and get, plus deposit posting, fixed-asset depreciation and disposal, recurring-schedule controls, and statement sending
- **Connection & discovery** — Connection status and per-org enabled-module discovery (no secrets exposed)

> CRM, Proposals, and Workflow tools require the org to have the Sales / Workflow
> modules enabled (always on for accounting firms; opt-in for self-service
> businesses). Call `get_enabled_modules` first to check.

## Prerequisites

- Node.js 18 or higher
- A KikoBooks or Accountant.World organization ([start free](https://ai.kikobooks.com/auth/get-started))
- An org API key: sign in, open **Settings → API Keys** ([direct link](https://ai.kikobooks.com/app/settings/api-keys)),
  create a key, and copy it once. Keys can be scoped, set to expire, and revoked at any time.

### Supported clients

Any MCP client that can launch a local (stdio) server: Claude Desktop, Claude Code, Cursor, Windsurf,
VS Code (GitHub Copilot), and others. ChatGPT connectors require a hosted (remote HTTPS) MCP endpoint,
which KikoBooks does not offer yet.

## Setup

> **Most users don't need this.** To use the published server, skip to
> [Configuration](#configuration) — the `npx` command pulls it from npm automatically.
> The steps below are for local development / contributing.

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```env
KIKOBOOKS_BASE_URL=https://ai.kikobooks.com
KIKOBOOKS_API_KEY=your_api_key_here
```

3. Build:
```bash
npm run build
```

## Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

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

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your project:

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

### Claude Code

```bash
claude mcp add kikobooks \
  -e KIKOBOOKS_BASE_URL=https://ai.kikobooks.com \
  -e KIKOBOOKS_API_KEY=your_api_key_here \
  -- npx -y @agentkiko/kikobooks-mcp-server@latest
```

### Cursor / Windsurf

Add the same `mcpServers` block shown for Claude Desktop to `~/.cursor/mcp.json` (Cursor) or
`~/.codeium/windsurf/mcp_config.json` (Windsurf).

### Read-only mode

Write, update, and delete tools load by default. To give an assistant analysis-only access, add these
to the `env` block of any configuration above:

```json
"KIKOBOOKS_DISABLE_WRITE": "true",
"KIKOBOOKS_DISABLE_UPDATE": "true",
"KIKOBOOKS_DISABLE_DELETE": "true"
```

Only `get_*`, `search_*`, and `list_*` tools are registered in this mode.

### Local Development

For local development, point to the built output:

```json
{
  "servers": {
    "kikobooks": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-kiko/dist/index.js"],
      "env": {
        "KIKOBOOKS_BASE_URL": "https://ai.kikobooks.com",
        "KIKOBOOKS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools (116 total)

### Chart of Accounts
| Tool | Description |
|------|-------------|
| `search_accounts` | Search accounts with filtering by category, type, and text |
| `get_account` | Get full account details by ID |
| `create_account` | Create a new GL account |
| `update_account` | Update an existing account |

### Customers
| Tool | Description |
|------|-------------|
| `search_customers` | Search customers with text search and pagination |
| `get_customer` | Get full customer details by ID |
| `create_customer` | Create a new customer |
| `update_customer` | Update an existing customer |
| `delete_customer` | Soft delete (deactivate) a customer |

### Invoices
| Tool | Description |
|------|-------------|
| `search_invoices` | Search invoices with status, customer, date, and overdue filters |
| `get_invoice` | Get full invoice details including line items and payments |
| `create_invoice` | Create a new invoice with line items |
| `update_invoice` | Update an existing invoice |

### Items (Products/Services)
| Tool | Description |
|------|-------------|
| `search_items` | Search products and services |
| `get_item` | Get item details including pricing |
| `create_item` | Create a new product or service |
| `update_item` | Update an existing item |

### Vendors
| Tool | Description |
|------|-------------|
| `search_vendors` | Search vendors with text search |
| `get_vendor` | Get full vendor details |
| `create_vendor` | Create a new vendor |
| `update_vendor` | Update an existing vendor |
| `delete_vendor` | Soft delete (deactivate) a vendor |

### Bills (Accounts Payable)
| Tool | Description |
|------|-------------|
| `search_bills` | Search bills with status, vendor, date, and overdue filters |
| `get_bill` | Get full bill details including line items |
| `create_bill` | Create a new bill |
| `update_bill` | Update an existing bill |
| `void_bill` | Void a posted bill (reverses accounting impact) |

### Journal Entries
| Tool | Description |
|------|-------------|
| `search_journal_entries` | Search entries with date, source, and posted filters |
| `get_journal_entry` | Get full entry with debit/credit lines |
| `create_journal_entry` | Create a manual journal entry (debits must equal credits) |
| `post_journal_entry` | Post a draft journal entry to the ledger |
| `reverse_journal_entry` | Reverse a posted journal entry |

### Bill Payments (Accounts Payable)
| Tool | Description |
|------|-------------|
| `search_bill_payments` | Search bill payments with vendor.and date filters |
| `get_bill_payment` | Get full bill payment details |
| `create_bill_payment` | Create a new bill payment |
| `void_bill_payment` | Void a bill payment (reverses accounting impact) |

### Purchases / Expenses
| Tool | Description |
|------|-------------|
| `search_purchases` | Search expense transactions with filters |
| `get_purchase` | Get full expense/purchase details |
| `create_purchase` | Create a new expense/purchase |
| `update_purchase` | Update an existing expense/purchase |
| `delete_purchase` | Delete an expense/purchase |

### Customer Payments (AR)
| Tool | Description |
|------|-------------|
| `search_payments` | Search AR payments with customer and date filters |
| `get_payment` | Get full payment details |
| `create_payment` | Record a customer payment |

### Credit Memos (AR)
| Tool | Description |
|------|-------------|
| `search_credit_memos` | Search credit memos with filters |
| `get_credit_memo` | Get full credit memo details |
| `create_credit_memo` | Create a new credit memo |

### Sales Receipts
| Tool | Description |
|------|-------------|
| `search_sales_receipts` | Search sales receipts with filters |
| `get_sales_receipt` | Get full sales receipt details |
| `create_sales_receipt` | Create a new sales receipt |

### CRM (requires the Sales module)
| Tool | Description |
|------|-------------|
| `search_leads` | Search CRM leads |
| `get_lead` | Get a lead by ID |
| `create_lead` | Create a new lead |
| `search_deals` | Search CRM deals (pipeline opportunities) |
| `get_deal` | Get a deal by ID |
| `create_deal` | Create a new deal from a lead |
| `update_deal` | Update an existing deal |
| `get_pipeline` | Get the pipeline with stages and per-stage deal counts |
| `move_deal_stage` | Move a deal to another pipeline stage |
| `promote_deal_to_customer` | Promote a deal's customer (gate before proposal/job) |

### Proposals (requires the Sales module)
| Tool | Description |
|------|-------------|
| `search_proposals` | Search proposals by customer, status, date |
| `get_proposal` | Get full proposal details |
| `copy_proposal` | Duplicate a proposal into a new draft |
| `generate_invoice_from_proposal` | Create a DRAFT invoice from a signed proposal (bridge) |
| `create_job_from_proposal` | Create a job with tasks from an accepted proposal (bridge) |

### Workflow (requires the Workflow module)
| Tool | Description |
|------|-------------|
| `search_jobs` | Search jobs (Projects for CB / Engagements for CA) |
| `get_job` | Get full job details |
| `list_job_tasks` | List the tasks for a job |
| `update_job_status` | Update a job's status |
| `update_task_status` | Update a task's status (e.g. mark complete) |
| `generate_invoice_from_job` | Create a DRAFT invoice from a job's timesheets + expenses (bridge) |

### Connection & Discovery
| Tool | Description |
|------|-------------|
| `get_connection_status` | Report connected / unauthenticated / disconnected — never returns secrets |
| `get_enabled_modules` | List which modules (Sales, Workflow) the org has enabled |

### Reports (read-only)
| Tool | Description |
|------|-------------|
| `get_trial_balance` | Trial balance (debit/credit per GL account) as of a date |
| `get_profit_and_loss` | Monthly profit & loss (income statement) trend |
| `get_ar_aging` | AR aging brackets (current, 1-30, 31-60, 61-90, 90+) |
| `get_ap_aging` | AP aging brackets (current, 1-30, 31-60, 61-90, 90+) |
| `get_cash_position` | Cash across GL + bank accounts as of a date |
| `get_expense_by_category` | Expense breakdown by category |
| `get_income_by_category` | Income breakdown by category |
| `get_business_health` | Composite business-health indicators |

### Banking & Reconciliation (read)
| Tool | Description |
|------|-------------|
| `search_bank_accounts` | Search bank accounts with paging and filters |
| `get_bank_account` | Get a bank account by ID |
| `search_bank_transactions` | Search imported bank transactions (append-only evidence) |
| `get_bank_transaction` | Get a bank transaction by ID |
| `search_reconciliation_sessions` | Search reconciliation sessions |
| `get_reconciliation_summary` | Reconciliation summary across accounts |

### Deposits, Fixed Assets, Recurring, Statements (read)
| Tool | Description |
|------|-------------|
| `search_deposits` / `get_deposit` | Bank deposits and allocated payments |
| `search_fixed_assets` / `get_fixed_asset` | Capitalized assets and depreciation settings |
| `search_recurring_schedules` / `get_recurring_schedule` | Recurring invoice schedules |
| `search_statements` / `get_statement` | Customer AR statements |
| `get_organization_details` | Connected org profile and settings |

### Deposits / Fixed Assets / Recurring / Statements / Reconciliation (write)
Mutating — require a read-write API key and are hidden when `KIKOBOOKS_DISABLE_WRITE` is set.
| Tool | Description |
|------|-------------|
| `create_deposit` / `update_deposit` / `delete_deposit` / `void_deposit` / `post_deposit` | Full deposit lifecycle (draft → post / void) |
| `create_fixed_asset` / `update_fixed_asset` / `dispose_fixed_asset` | Fixed-asset register and disposal |
| `run_depreciation` | Post depreciation for a fiscal year + period |
| `delete_recurring_schedule` / `pause_recurring_schedule` / `resume_recurring_schedule` / `activate_recurring_schedule` / `generate_recurring_invoice` | Recurring schedule lifecycle |
| `delete_statement` / `send_statement` | Customer statement delete and send |
| `start_reconciliation` / `complete_reconciliation` / `cancel_reconciliation` / `set_statement_balance` | Bank reconciliation session lifecycle |

> Not yet exposed (deferred): `create_recurring_schedule`, `create_statement`, and
> per-transaction bank match/categorize — their request bodies are large nested
> templates that warrant dedicated design rather than a best-effort mapping.

### Scope tiers
Read tools (`get_*`, `search_*`, `list_*`) always load. Mutating tools load by default and are grouped
into scope tiers that can be suppressed at startup (set the flag to `true` or `1`):

| Env flag | Suppresses |
|----------|------------|
| `KIKOBOOKS_DISABLE_WRITE` | `create_*`, `post_*`, `reverse_*`, `move_*`, `promote_*`, `copy_*`, `generate_*`, `send_*`, `approve_*`, `dispose_*`, `run_*`, `pause_*`, `resume_*`, `activate_*`, `start_*`, `complete_*`, `cancel_*`, `set_*` |
| `KIKOBOOKS_DISABLE_UPDATE` | `update_*` |
| `KIKOBOOKS_DISABLE_DELETE` | `delete_*`, `void_*` |

## Security

- The API key is exchanged for short-lived JWTs. It is never written to disk, logged, or returned to the model.
- Every call goes through the same permission-checked KikoBooks API your team uses, scoped to the key's organization.
- Posted ledger entries cannot be edited or deleted through any tool; corrections are reversals or credit memos.
- MCP clients ask you to confirm tool calls before they run. Review each write before you approve it.
- Report vulnerabilities to info@accountant.world with the subject "Security vulnerability report".

## Authentication

The server supports two authentication methods:

### API Key (Recommended)
Set `KIKOBOOKS_API_KEY` — the server automatically exchanges it for JWT tokens and handles refresh.

### Direct Token
Set `KIKOBOOKS_ACCESS_TOKEN` (and optionally `KIKOBOOKS_REFRESH_TOKEN`) if you manage tokens externally.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KIKOBOOKS_BASE_URL` | Yes | KikoBooks API base URL |
| `KIKOBOOKS_API_KEY` | Yes* | Org API key for authentication |
| `KIKOBOOKS_ACCESS_TOKEN` | Alt* | Direct JWT access token |
| `KIKOBOOKS_REFRESH_TOKEN` | No | JWT refresh token |
| `KIKOBOOKS_TOKEN_STORE_PATH` | No | Absolute path to persist the rotated JWT between runs (API key is never written) |
| `KIKOBOOKS_DISABLE_WRITE` | No | Suppress create/post/action and bridge tools |
| `KIKOBOOKS_DISABLE_UPDATE` | No | Suppress update tools |
| `KIKOBOOKS_DISABLE_DELETE` | No | Suppress delete/void tools |

\* Either `KIKOBOOKS_API_KEY` or `KIKOBOOKS_ACCESS_TOKEN` is required.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch

# Lint
npm run lint
```

## Architecture

```
src/
├── index.ts                 # Entry point
├── config.ts                # Env config (base URL, key, token-store path, scope flags)
├── clients/
│   ├── kikobooks-client.ts   # HTTP client with JWT auth + auto-refresh (get/post/put/delete)
│   └── token-store.ts        # Optional file-backed JWT cache (API key never persisted)
├── server/
│   └── kikobooks-mcp-server.ts  # MCP server singleton
├── tools/                   # Tool definitions grouped by verb, registered via tool-factory
│   ├── tool-factory.ts       # Registers all tools + applies scope-tier gating
│   ├── search/  get/  create/  update/  delete/  action/
│   └── ... (116 tools)
├── handlers/                # Business logic (calls the API client)
├── helpers/                 # register-tool, format-error, get-package-version
└── types/                   # tool-definition, tool-response
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full implementation plan:
- **Phase 1** ✅ Core Bookkeeping (12 accounting entities)
- **Phase 2** ✅ Practice Management (CRM, Proposals, Workflow) + lifecycle bridges
- **Phase 3** ✅ Banking & Reconciliation
- **Phase 4** ✅ Reports & Analytics

## License

MIT — see [LICENSE](LICENSE)

## Links

- [KikoBooks](https://kikobooks.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Accountant Inc.](https://www.agentkiko.com) — publisher of KikoBooks, Accountant.World, and Agent Kiko
