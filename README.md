# Paper-MCP (PaperMC Javadoc MCP Server)

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
git clone [https://github.com/yourusername/paper-mcp.git](https://github.com/yourusername/paper-mcp.git)
cd paper-mcp
npm install