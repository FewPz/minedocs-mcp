import type { ClassInfo, FieldSummaryEntry, MethodDetail, PackageClassEntry, DeprecatedEntry } from "../types.js";

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

export function formatSearchResults(keyword: string, matches: string[], limit: number): string {
  if (matches.length === 0) {
    return `No classes found matching keyword "${keyword}". Try a different or shorter keyword.`;
  }

  const shown = matches.slice(0, limit);
  const lines: string[] = [];

  lines.push(`# Search results for "${keyword}"`);
  lines.push(
    matches.length > shown.length
      ? `Showing ${shown.length} of ${matches.length} matches.`
      : `Found ${shown.length} match${shown.length === 1 ? "" : "es"}.`
  );
  lines.push("");

  for (const className of shown) {
    lines.push(`- \`${className}\``);
  }

  lines.push("");
  lines.push(
    "_Use `get_paper_class_info` with any of these full class names to see its signature, description, and methods._"
  );

  return lines.join("\n");
}

export function formatFieldSummary(fullClassName: string, url: string, fields: FieldSummaryEntry[]): string {
  const lines: string[] = [];

  lines.push(`# ${fullClassName} - Field Summary`);
  lines.push(`Source: ${url}`);
  lines.push("");

  if (fields.length === 0) {
    lines.push("_No fields found on this page._");
  } else {
    for (const f of fields) {
      lines.push(`- \`${f.returnType} ${f.signature}\``);
      if (f.description) {
        lines.push(`  ${f.description}`);
      }
    }
  }

  return lines.join("\n");
}

export function formatMethodDetails(
  fullClassName: string,
  methodName: string,
  url: string,
  details: MethodDetail[]
): string {
  if (details.length === 0) {
    return (
      `No method named "${methodName}" was found on "${fullClassName}".\n` +
      `Source checked: ${url}\n` +
      `Check the spelling, or use \`get_paper_class_info\` to see the full method list first.`
    );
  }

  const lines: string[] = [];
  lines.push(`# ${fullClassName}#${methodName}`);
  lines.push(`Source: ${url}`);
  lines.push(
    details.length > 1 ? `Found ${details.length} overloads.` : "Found 1 overload."
  );
  lines.push("");

  for (const d of details) {
    lines.push(`## ${d.signature || d.name}`);
    lines.push("");
    if (d.description) {
      lines.push(d.description);
      lines.push("");
    }
    for (const [label, values] of Object.entries(d.notes)) {
      lines.push(`**${label}:**`);
      for (const v of values) {
        lines.push(`- ${v}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd();
}

export function formatPackageClasses(packageName: string, url: string, classes: PackageClassEntry[], limit: number): string {
  if (classes.length === 0) {
    return (
      `No classes found for package "${packageName}".\n` +
      `Source checked: ${url}\n` +
      `Check the package name is correct (e.g. "org.bukkit.event.block").`
    );
  }

  const shown = classes.slice(0, limit);
  const lines: string[] = [];

  lines.push(`# Package: ${packageName}`);
  lines.push(`Source: ${url}`);
  lines.push(
    classes.length > shown.length
      ? `Showing ${shown.length} of ${classes.length} classes.`
      : `${shown.length} class${shown.length === 1 ? "" : "es"}.`
  );
  lines.push("");

  for (const c of shown) {
    const kindLabel = c.kind ? ` (${c.kind})` : "";
    lines.push(`- \`${c.fullClassName}\`${kindLabel}`);
    if (c.description) {
      lines.push(`  ${c.description}`);
    }
  }

  lines.push("");
  lines.push("_Use `get_paper_class_info` with any of these full class names for details._");

  return lines.join("\n");
}

export function formatDeprecatedResults(keyword: string | undefined, entries: DeprecatedEntry[], limit: number): string {
  if (entries.length === 0) {
    return keyword
      ? `No deprecated APIs found matching keyword "${keyword}".`
      : "No deprecated APIs found.";
  }

  const shown = entries.slice(0, limit);
  const lines: string[] = [];

  lines.push(keyword ? `# Deprecated APIs matching "${keyword}"` : "# Deprecated APIs");
  lines.push(
    entries.length > shown.length
      ? `Showing ${shown.length} of ${entries.length} matches.`
      : `Found ${shown.length} match${shown.length === 1 ? "" : "es"}.`
  );
  lines.push("");

  for (const e of shown) {
    lines.push(`- **[${e.category}]** \`${e.name}\``);
    if (e.reason) {
      lines.push(`  ${e.reason}`);
    }
  }

  return lines.join("\n");
}
