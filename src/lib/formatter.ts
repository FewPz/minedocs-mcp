import type { ClassInfo } from "../types.js";

export function formatAsMarkdown(fullClassName: string, url: string, info: ClassInfo): string {
  const lines: string[] = [];

  lines.push(`# ${fullClassName}`);
  lines.push(`Source: ${url}`);
  lines.push("");

  if (info.signature) {
    lines.push("## Signature");
    lines.push("```java");
    lines.push(info.signature);
    lines.push("```");
    lines.push("");
  }

  lines.push("## Description");
  lines.push(info.description || "_No description available._");
  lines.push("");

  lines.push("## Method Summary");
  if (info.methods.length === 0) {
    lines.push("_No methods found on this page._");
  } else {
    for (const m of info.methods) {
      lines.push(`- \`${m.returnType} ${m.signature}\``);
      if (m.description) {
        lines.push(`  ${m.description}`);
      }
    }
  }

  return lines.join("\n");
}
