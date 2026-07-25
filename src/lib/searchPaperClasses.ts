import { fetchAllClassesIndexPage } from "./scraper.js";
import { parseAllClassesIndex } from "./parser.js";
import { formatSearchResults } from "./formatter.js";
import { MAX_SEARCH_RESULTS } from "../config.js";

export async function searchPaperClassesMarkdown(keyword: string): Promise<string> {
  const page = await fetchAllClassesIndexPage();
  if (!page.ok) {
    return page.message;
  }

  const matches = parseAllClassesIndex(page.html, keyword);
  return formatSearchResults(keyword, matches, MAX_SEARCH_RESULTS);
}
