import { classNameToUrl } from "./url.js";

export type FetchPageResult =
  | { ok: true; url: string; html: string }
  | { ok: false; url: string; message: string };

export async function fetchClassPage(fullClassName: string): Promise<FetchPageResult> {
  const url = classNameToUrl(fullClassName);

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
    return {
      ok: false,
      url,
      message:
        `Error: no Javadoc page found for class "${fullClassName}".\n` +
        `Attempted URL: ${url}\n` +
        `Check that the fully-qualified class name is correct (e.g. "org.bukkit.entity.Player") ` +
        `and that it exists in the PaperMC 26.2 API.`,
    };
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
