import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClassInfoMarkdown } from "../lib/getClassInfoMarkdown.js";

export function registerGetPaperClassInfo(server: McpServer): void {
  server.registerTool(
    "get_paper_class_info",
    {
      title: "Get PaperMC Class Info",
      description:
        "Fetches and parses the PaperMC 26.2 Javadoc page for a fully-qualified class name, " +
        "returning its signature, description, and method summary as Markdown.",
      inputSchema: {
        fullClassName: z
          .string()
          .min(1)
          .describe('Fully-qualified class name, e.g. "org.bukkit.entity.Player"'),
      },
    },
    async ({ fullClassName }) => {
      try {
        const markdown = await getClassInfoMarkdown(fullClassName);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[get_paper_class_info] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [
            { type: "text", text: `Error: unexpected failure while fetching "${fullClassName}": ${message}` },
          ],
          isError: true,
        };
      }
    }
  );
}
