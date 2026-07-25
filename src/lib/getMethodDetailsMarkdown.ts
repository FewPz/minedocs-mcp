import { fetchClassPage } from "./scraper.js";
import { parseMethodDetails } from "./parser.js";
import { formatMethodDetails } from "./formatter.js";

export async function getMethodDetailsMarkdown(fullClassName: string, methodName: string): Promise<string> {
  const page = await fetchClassPage(fullClassName);
  if (!page.ok) {
    return page.message;
  }

  const details = parseMethodDetails(page.html, methodName);
  return formatMethodDetails(fullClassName, methodName, page.url, details);
}
