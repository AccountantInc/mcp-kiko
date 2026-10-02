# Getting Started with KikoBooks MCP Server

## Prerequisites

1. A KikoBooks account with API access
2. Node.js 18 or higher
3. An API key from your KikoBooks organization settings

## Getting Your API Key

1. Log in to KikoBooks at https://dev.kikobooks.com
2. Navigate to **Settings** → **API & Integrations**
3. Click **Generate API Key**
4. Copy the key — you'll need it for the MCP server configuration

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
