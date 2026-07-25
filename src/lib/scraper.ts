import { PAPER_JAVADOC_BASE_URL, CACHE_TTL_MS } from "../config.js";
import { classNameToUrl, packageNameToUrl } from "./url.js";
import { getCached, setCached } from "./cache.js";

export type FetchPageResult =
  | { ok: true; url: string; html: string }
  | { ok: false; url: string; message: string };

async function fetchPageUncached(url: string, notFoundMessage: string): Promise<FetchPageResult> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[scraper] network error fetching ${url}: ${message}`);
    return {
      ok: false,
      url,
      message: `Error: failed to reach PaperMC Javadoc site (${message}). URL attempted: ${url}`,
    };
  }

  if (response.status === 404) {
    return { ok: false, url, message: notFoundMessage };
  }

  if (!response.ok) {
    console.error(`[scraper] unexpected status ${response.status} for ${url}`);
    return {
      ok: false,
      url,
      message: `Error: PaperMC Javadoc site returned HTTP ${response.status} for ${url}.`,
    };
  }

  const html = await response.text();
  return { ok: true, url, html };
}

async function fetchPage(url: string, notFoundMessage: string): Promise<FetchPageResult> {
  const cached = getCached<FetchPageResult>(url);
  if (cached) {
    return cached;
  }

  const result = await fetchPageUncached(url, notFoundMessage);
  if (result.ok) {
    // Only cache successes - a transient network error or 404 shouldn't stick around.
    setCached(url, result, CACHE_TTL_MS);
  }
  return result;
}

export async function fetchClassPage(fullClassName: string): Promise<FetchPageResult> {
  const url = classNameToUrl(fullClassName);
  return fetchPage(
    url,
    `Error: no Javadoc page found for class "${fullClassName}".\n` +
      `Attempted URL: ${url}\n` +
      `Check that the fully-qualified class name is correct (e.g. "org.bukkit.entity.Player") ` +
      `and that it exists in the PaperMC 26.2 API.`
  );
}

export async function fetchAllClassesIndexPage(): Promise<FetchPageResult> {
  const url = `${PAPER_JAVADOC_BASE_URL}allclasses-index.html`;
  return fetchPage(url, `Error: could not load the all-classes index at ${url}.`);
}

export async function fetchPackageSummaryPage(packageName: string): Promise<FetchPageResult> {
  const url = packageNameToUrl(packageName);
  return fetchPage(
    url,
    `Error: no package summary found for "${packageName}".\n` +
      `Attempted URL: ${url}\n` +
      `Check that the package name is correct (e.g. "org.bukkit.event.block") ` +
      `and that it exists in the PaperMC 26.2 API.`
  );
}

export async function fetchDeprecatedListPage(): Promise<FetchPageResult> {
  const url = `${PAPER_JAVADOC_BASE_URL}deprecated-list.html`;
  return fetchPage(url, `Error: could not load the deprecated API list at ${url}.`);
}
