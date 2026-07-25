import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetPaperClassInfo } from "./tools/getPaperClassInfo.js";

const server = new McpServer({
  name: "minedocs-mcp",
  version: "26.1.1-alpha",
});

registerGetPaperClassInfo(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("minedocs-mcp server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
