# Contributing to the KikoBooks MCP Server

This server is published by **Accountant Inc.** (KikoBooks, Accountant.World, Agent Kiko) as
`@agentkiko/kikobooks-mcp-server`. Please keep these facts accurate in code, `README.md`,
`SKILL.md`, and anything that copies them (the KikoBooks app's API-keys panel and the
kikobooks.com, accountant.world, and agentkiko.com sites).

## Facts that must stay true

- **Transport:** stdio only. KikoBooks has no hosted (remote HTTPS) MCP endpoint, so ChatGPT
  connectors are not supported. Supported clients: Claude Desktop, Claude Code, Cursor, Windsurf,
  VS Code (GitHub Copilot), and other clients that launch local servers.
- **Write defaults:** read tools (`get_*`, `search_*`, `list_*`) always load. Write, update, and
  delete tools load **by default**; `KIKOBOOKS_DISABLE_WRITE` / `_UPDATE` / `_DELETE` turn them off.
  Never describe the server as "read-only by default".
- **Approval:** the server has no approval gate of its own. The MCP client asks the user to confirm
  each tool call, and the KikoBooks API enforces permissions and ledger immutability.
- **Tool count:** `npm run verify` asserts the catalog. Update every "N tools" mention when it changes.
- **Required config:** `KIKOBOOKS_BASE_URL=https://ai.kikobooks.com` plus `KIKOBOOKS_API_KEY`.
  Claude/Cursor configs use `mcpServers`; VS Code uses `servers`.
- **Identity:** company is Accountant Inc.; advisor8.com no longer exists — do not link to it.

## Develop and verify

```bash
npm install
npm run build
npm run verify   # tool catalog + scope-tier gating (no API key needed)
npm run smoke    # live calls; needs a real KIKOBOOKS_API_KEY in .env
```

## Release

1. Bump `version` in `package.json` (and run `npm install --package-lock-only`).
2. Commit, then push a tag `vX.Y.Z`.
3. The **Release (npm publish)** workflow runs `npm run verify` and publishes with npm provenance.

`npm` always packs `README.md`, `LICENSE`, and `package.json`, so README or metadata changes reach
the npm page only after a new version is published.

## Security

Never log, persist, or return the API key or tokens. Report vulnerabilities to
info@accountant.world with the subject "Security vulnerability report".
