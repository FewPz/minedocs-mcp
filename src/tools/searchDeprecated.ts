import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchDeprecatedMarkdown } from "../lib/searchDeprecatedMarkdown.js";

export function registerSearchDeprecated(server: McpServer): void {
  server.registerTool(
    "search_deprecated",
    {
      title: "Search PaperMC Deprecated APIs",
      description:
        "Lists deprecated PaperMC APIs (interfaces, classes, methods, fields, etc.), optionally filtered " +
        "by keyword, so the AI can avoid recommending deprecated methods/classes.",
      inputSchema: {
        keyword: z
          .string()
          .min(1)
          .optional()
          .describe('Optional keyword to filter by, e.g. "Timing" or "getWarningTime". Omit to list all.'),
      },
    },
    async ({ keyword }) => {
      try {
        const markdown = await searchDeprecatedMarkdown(keyword);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[search_deprecated] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [{ type: "text", text: `Error: unexpected failure while searching deprecated APIs: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
