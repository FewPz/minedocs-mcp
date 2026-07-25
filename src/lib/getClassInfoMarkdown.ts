import { fetchClassPage } from "./scraper.js";
import { parseClassPage } from "./parser.js";
import { formatAsMarkdown } from "./formatter.js";

export async function getClassInfoMarkdown(fullClassName: string): Promise<string> {
  const page = await fetchClassPage(fullClassName);
  if (!page.ok) {
    return page.message;
  }

  const info = parseClassPage(page.html);

  if (!info.signature && !info.description && info.methods.length === 0) {
    return (
      `Error: page at ${page.url} loaded but no recognizable class content was found. ` +
      `The page structure may have changed, or "${fullClassName}" may not be a class/interface page.`
    );
  }

  return formatAsMarkdown(fullClassName, page.url, info);
}
