# MineDocs MCP (PaperMC Javadoc MCP Server)

An open-source Model Context Protocol (MCP) server designed to supercharge your AI assistants (like Claude Desktop and Cursor) with real-time, accurate PaperMC API documentation. built specifically for Minecraft Java Edition plugin developers.

## Why use this?
When asking AI to write Minecraft plugins, it often hallucinates non-existent methods, uses deprecated Spigot APIs, or confuses variable types. **Paper-MCP solves this.**

By providing a direct bridge to the official [PaperMC Javadocs](https://jd.papermc.io/), your AI can fetch the exact class definitions, method summaries, and return types *before* it writes a single line of code.

## Features
- **Real-time API Fetching:** Scrapes the latest Javadocs directly from `jd.papermc.io`.
- **Zero Hallucinations:** AI writes code based on actual current API methods, not outdated training data.
- **AI-Optimized Output:** Converts messy HTML Javadocs into clean, readable Markdown structure for LLMs.
- **Seamless Integration:** Works out-of-the-box with any MCP-compatible client (Claude Desktop, Cursor, etc.).

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
Point your client at the compiled entrypoint. Example for Claude Desktop / Cursor (`claude_desktop_config.json` or equivalent):

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
Restart Claude Desktop / Cursor so it picks up the new MCP server. The `get_paper_class_info` tool should now be available.

## Usage

Ask your AI assistant something like:

> Look up `org.bukkit.entity.Player` in PaperMC and show me its methods.

The AI will call `get_paper_class_info` with `fullClassName: "org.bukkit.entity.Player"` and get back a Markdown summary of the class signature, description, and method list.

## Development

```bash
pnpm dev    # tsx watch mode, restarts on file changes
pnpm build  # type-check and compile to dist/
```