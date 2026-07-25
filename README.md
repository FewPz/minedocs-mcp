# MineDocs MCP (PaperMC Javadoc MCP Server)

An open-source Model Context Protocol (MCP) server designed to supercharge your AI assistants (like Claude Desktop and Cursor) with real-time, accurate PaperMC API documentation. built specifically for Minecraft Java Edition plugin developers.

## Why use this?
When asking AI to write Minecraft plugins, it often hallucinates non-existent methods, uses deprecated Spigot APIs, or confuses variable types. **Paper-MCP solves this.**

By providing a direct bridge to the official [PaperMC Javadocs](https://jd.papermc.io/), your AI can fetch the exact class definitions, method summaries, and return types *before* it writes a single line of code.

## Features
- **Real-time API Fetching:** Scrapes the latest Javadocs directly from `jd.papermc.io`.
- **Zero Hallucinations:** AI writes code based on actual current API methods, not outdated training data.
- **AI-Optimized Output:** Converts messy HTML Javadocs into clean, readable Markdown structure for LLMs.
- **Seamless Integration:** Works out-of-the-box with any MCP-compatible client (Claude Code, Codex CLI, Claude Desktop, Cursor, etc.).
- **In-memory caching:** Repeated lookups within a session skip re-fetching the same page (10-minute TTL).

## Tools

| Tool | Purpose |
|---|---|
| `get_paper_class_info` | Signature, description, and method summary for a fully-qualified class |
| `search_paper_classes` | Find a class's full package name by keyword |
| `get_method_details` | Full docs for one method - params, returns, throws, since, all overloads |
| `get_field_summary` | Field/constant table for a class |
| `list_package_classes` | Every class/interface/enum in a package |
| `search_deprecated` | Deprecated PaperMC APIs, optionally filtered by keyword - so the AI avoids them |

## Installation & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/FewPz/minedocs-mcp
cd minedocs-mcp
pnpm install
```

### 2. Build
```bash
pnpm build
```
This compiles `src/` to `dist/`.

### 3. Configure your MCP client

#### Claude Code
```bash
claude mcp add minedocs -- node /absolute/path/to/minedocs-mcp/dist/server.js
```
Add `-s user` instead of the default local scope if you want it available in every project, not just the one you run this from:
```bash
claude mcp add minedocs -s user -- node /absolute/path/to/minedocs-mcp/dist/server.js
```
Verify:
```bash
claude mcp list
```
Then start a **new** `claude` session (MCP servers load at session start) and run `/mcp` to confirm `minedocs` is connected.

#### Codex CLI
```bash
codex mcp add minedocs -- node /absolute/path/to/minedocs-mcp/dist/server.js
```
Verify:
```bash
codex mcp list
```

Or edit `~/.codex/config.toml` directly:
```toml
[mcp_servers.minedocs]
command = "node"
args = ["/absolute/path/to/minedocs-mcp/dist/server.js"]
```

#### Claude Desktop / Cursor
Point your client at the compiled entrypoint (`claude_desktop_config.json` or equivalent):

```json
{
  "mcpServers": {
    "minedocs": {
      "command": "node",
      "args": ["/absolute/path/to/minedocs-mcp/dist/server.js"]
    }
  }
}
```

Replace `/absolute/path/to/minedocs-mcp` with wherever you cloned the repo.

**Alternative (no build step, runs TypeScript directly via tsx):**
```json
{
  "mcpServers": {
    "minedocs": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/minedocs-mcp/src/server.ts"]
    }
  }
}
```

### 4. Restart your client
Restart Claude Desktop / Cursor, or start a new Claude Code / Codex CLI session, so it picks up the new MCP server.

## Usage

Ask your AI assistant something like:

> Look up `org.bukkit.entity.Player` in PaperMC and show me its methods.

> Search PaperMC for classes related to "BlockBreak".

> What are the parameters for Player's `teleport` method?

> List all classes in `org.bukkit.event.block`.

> Is `Player.getDisplayName()` deprecated?

The AI picks the right tool automatically based on your question and returns a Markdown-formatted answer sourced live from `jd.papermc.io`.

## Development

```bash
pnpm dev    # tsx watch mode, restarts on file changes
pnpm build  # type-check and compile to dist/
```