import { fetchDeprecatedListPage } from "./scraper.js";
import { parseDeprecatedList } from "./parser.js";
import { formatDeprecatedResults } from "./formatter.js";
import { MAX_SEARCH_RESULTS } from "../config.js";

export async function searchDeprecatedMarkdown(keyword: string | undefined): Promise<string> {
  const page = await fetchDeprecatedListPage();
  if (!page.ok) {
    return page.message;
  }

  const all = parseDeprecatedList(page.html);
  const filtered = keyword
    ? all.filter(
        (e) =>
          e.name.toLowerCase().includes(keyword.toLowerCase()) ||
          e.reason.toLowerCase().includes(keyword.toLowerCase())
      )
    : all;

  return formatDeprecatedResults(keyword, filtered, MAX_SEARCH_RESULTS);
}
