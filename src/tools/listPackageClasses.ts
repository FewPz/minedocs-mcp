import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listPackageClassesMarkdown } from "../lib/listPackageClassesMarkdown.js";

export function registerListPackageClasses(server: McpServer): void {
  server.registerTool(
    "list_package_classes",
    {
      title: "List PaperMC Package Classes",
      description:
        "Lists every class/interface/enum in a given PaperMC package, with its kind and short description.",
      inputSchema: {
        packageName: z
          .string()
          .min(1)
          .describe('Fully-qualified package name, e.g. "org.bukkit.event.block"'),
      },
    },
    async ({ packageName }) => {
      try {
        const markdown = await listPackageClassesMarkdown(packageName);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[list_package_classes] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [{ type: "text", text: `Error: unexpected failure while listing "${packageName}": ${message}` }],
          isError: true,
        };
      }
    }
  );
}
