import * as cheerio from "cheerio";

export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export interface ThreeColumnRow {
  first: string;
  second: string;
  last: string;
}

/**
 * PaperMC's method/field summary tables are a CSS grid: rows are flattened
 * divs classed col-first / col-second / col-last, not <tr> elements, so we
 * group by these column classes instead of table rows.
 */
export function parseThreeColumnSummaryTable(
  $: ReturnType<typeof cheerio.load>,
  rowsSelector: string
): ThreeColumnRow[] {
  const rows: ThreeColumnRow[] = [];
  let first = "";
  let second = "";

  $(rowsSelector).each((_, el) => {
    const $el = $(el);
    const classAttr = $el.attr("class") ?? "";

    if (classAttr.includes("table-header")) return;

    if (classAttr.includes("col-first")) {
      first = collapseWhitespace($el.text());
    } else if (classAttr.includes("col-second")) {
      second = collapseWhitespace($el.text());
    } else if (classAttr.includes("col-last")) {
      const last = collapseWhitespace($el.text());
      if (second) {
        rows.push({ first, second, last });
      }
      first = "";
      second = "";
    }
  });

  return rows;
}

export interface TwoColumnRow {
  text: string;
  href: string | null;
  title: string | null;
  description: string;
}

/**
 * Same flattened-grid layout as the three-column tables, but for two-column
 * tables (package class lists, deprecated-list categories) the name column
 * is classed either col-first or col-summary-item-name depending on page.
 */
export function parseTwoColumnSummaryTable(
  $: ReturnType<typeof cheerio.load>,
  rowsSelector: string
): TwoColumnRow[] {
  const rows: TwoColumnRow[] = [];
  let text = "";
  let href: string | null = null;
  let title: string | null = null;
  let havePending = false;

  $(rowsSelector).each((_, el) => {
    const $el = $(el);
    const classAttr = $el.attr("class") ?? "";

    if (classAttr.includes("table-header")) return;

    if (classAttr.includes("col-first") || classAttr.includes("col-summary-item-name")) {
      const $link = $el.find("a").first();
      text = collapseWhitespace($el.text());
      href = $link.attr("href") ?? null;
      title = $link.attr("title") ?? null;
      havePending = true;
    } else if (classAttr.includes("col-last")) {
      const description = collapseWhitespace($el.text());
      if (havePending) {
        rows.push({ text, href, title, description });
      }
      havePending = false;
      text = "";
      href = null;
      title = null;
    }
  });

  return rows;
}
