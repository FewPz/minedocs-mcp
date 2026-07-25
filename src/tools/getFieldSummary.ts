import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFieldSummaryMarkdown } from "../lib/getFieldSummaryMarkdown.js";

export function registerGetFieldSummary(server: McpServer): void {
  server.registerTool(
    "get_field_summary",
    {
      title: "Get PaperMC Field Summary",
      description:
        "Fetches the field/constant summary table for a fully-qualified PaperMC class name " +
        "(modifiers, type, name, and description of each field).",
      inputSchema: {
        fullClassName: z
          .string()
          .min(1)
          .describe('Fully-qualified class name, e.g. "org.bukkit.ChatColor"'),
      },
    },
    async ({ fullClassName }) => {
      try {
        const markdown = await getFieldSummaryMarkdown(fullClassName);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[get_field_summary] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [{ type: "text", text: `Error: unexpected failure while fetching "${fullClassName}": ${message}` }],
          isError: true,
        };
      }
    }
  );
}
