import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchPaperClassesMarkdown } from "../lib/searchPaperClasses.js";

export function registerSearchPaperClasses(server: McpServer): void {
  server.registerTool(
    "search_paper_classes",
    {
      title: "Search PaperMC Classes",
      description:
        "Search for a class name by keyword (e.g., 'Player', 'BlockBreak') to find its Full Package Name.",
      inputSchema: {
        keyword: z.string().min(1).describe('Keyword to search for, e.g. "Player" or "BlockBreak"'),
      },
    },
    async ({ keyword }) => {
      try {
        const markdown = await searchPaperClassesMarkdown(keyword);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[search_paper_classes] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [
            { type: "text", text: `Error: unexpected failure while searching for "${keyword}": ${message}` },
          ],
          isError: true,
        };
      }
    }
  );
}
