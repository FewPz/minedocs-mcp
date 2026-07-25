import { fetchClassPage } from "./scraper.js";
import { parseFieldSummary } from "./parser.js";
import { formatFieldSummary } from "./formatter.js";

export async function getFieldSummaryMarkdown(fullClassName: string): Promise<string> {
  const page = await fetchClassPage(fullClassName);
  if (!page.ok) {
    return page.message;
  }

  const fields = parseFieldSummary(page.html);
  return formatFieldSummary(fullClassName, page.url, fields);
}
