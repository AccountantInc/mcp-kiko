# Getting Started with KikoBooks MCP Server

## Prerequisites

1. A KikoBooks account with API access
2. Node.js 18 or higher
3. An API key from your KikoBooks organization settings

## Getting Your API Key

1. Log in to KikoBooks at https://ai.kikobooks.com
2. Navigate to **Settings** → **Preferences** → **API Keys**
3. Click **Generate Key** and choose a scope — **Read-only** or **Read & write**
   (write-tier is required for any `create_*` / `update_*` / `post_*` / `void_*` tool)
4. Copy the key — you'll need it for the MCP server configuration (it is shown once)

## Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```env
KIKOBOOKS_BASE_URL=https://ai.kikobooks.com
KIKOBOOKS_API_KEY=your_api_key_here
```

## Testing the Connection

```bash
npm install
npm run build
node dist/index.js
```

If the server starts without errors, your connection is configured correctly.
