import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getMethodDetailsMarkdown } from "../lib/getMethodDetailsMarkdown.js";

export function registerGetMethodDetails(server: McpServer): void {
  server.registerTool(
    "get_method_details",
    {
      title: "Get PaperMC Method Details",
      description:
        "Fetches the full documentation for a specific method on a PaperMC class - " +
        "signature, description, parameters, return value, throws, and since-version. " +
        "If the method is overloaded, returns details for every overload.",
      inputSchema: {
        fullClassName: z
          .string()
          .min(1)
          .describe('Fully-qualified class name, e.g. "org.bukkit.entity.Player"'),
        methodName: z
          .string()
          .min(1)
          .describe('Bare method name, no parameters, e.g. "teleport" or "sendMessage"'),
      },
    },
    async ({ fullClassName, methodName }) => {
      try {
        const markdown = await getMethodDetailsMarkdown(fullClassName, methodName);
        return { content: [{ type: "text", text: markdown }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[get_method_details] unexpected error: ${err instanceof Error ? err.stack : message}`);
        return {
          content: [
            {
              type: "text",
              text: `Error: unexpected failure while fetching "${fullClassName}#${methodName}": ${message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
