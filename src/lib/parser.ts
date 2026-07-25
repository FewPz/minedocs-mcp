import * as cheerio from "cheerio";
import type { ClassInfo, MethodSummaryEntry, FieldSummaryEntry, MethodDetail, PackageClassEntry, DeprecatedEntry } from "../types.js";
import { collapseWhitespace, parseThreeColumnSummaryTable, parseTwoColumnSummaryTable } from "./tableParsing.js";

export function parseClassPage(html: string): ClassInfo {
  const $ = cheerio.load(html);

  const signature = collapseWhitespace($(".type-signature").first().text());

  // Current PaperMC Javadoc (JDK 17+ style) uses .class-description .block;
  // fall back to the older .description .block in case the site's javadoc version shifts.
  const descriptionEl = $(".class-description .block").first().length
    ? $(".class-description .block").first()
    : $(".description .block").first();
  const description = collapseWhitespace(descriptionEl.text());

  const methods: MethodSummaryEntry[] = parseThreeColumnSummaryTable(
    $,
    "#method-summary-table .summary-table > div"
  ).map((row) => ({ returnType: row.first, signature: row.second, description: row.last }));

  return { signature, description, methods };
}

export function parseFieldSummary(html: string): FieldSummaryEntry[] {
  const $ = cheerio.load(html);
  return parseThreeColumnSummaryTable($, "#field-summary .summary-table > div").map((row) => ({
    returnType: row.first,
    signature: row.second,
    description: row.last,
  }));
}

function hrefToFullClassName(href: string): string | null {
  if (!href.endsWith(".html")) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return null;
  if (!href.includes("/")) return null; // top-nav junk (index.html, search.html, ...) has no package path
  if (href.startsWith("index-")) return null;
  if (href.includes("help-doc")) return null;

  return href.slice(0, -".html".length).replace(/\//g, ".");
}

export function parseAllClassesIndex(html: string, keyword: string): string[] {
  const $ = cheerio.load(html);
  const lowerKeyword = keyword.toLowerCase();
  const matches = new Set<string>();

  $("a").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href) return;

    const linkText = $el.text();
    if (!linkText.toLowerCase().includes(lowerKeyword)) return;

    const fullClassName = hrefToFullClassName(href);
    if (fullClassName) {
      matches.add(fullClassName);
    }
  });

  return [...matches];
}

/**
 * Each overload of a method gets its own <section class="detail" id="name(paramTypes)">
 * block on the class page, with <h3> holding the bare method name (no params) -
 * so matching by h3 text naturally returns every overload for that name.
 */
export function parseMethodDetails(html: string, methodName: string): MethodDetail[] {
  const $ = cheerio.load(html);
  const lowerName = methodName.toLowerCase();
  const results: MethodDetail[] = [];

  $("section.detail").each((_, el) => {
    const $el = $(el);
    const name = collapseWhitespace($el.find("h3").first().text());
    if (name.toLowerCase() !== lowerName) return;

    const anchorId = $el.attr("id") ?? "";
    const signature = collapseWhitespace($el.find(".member-signature").first().text());
    const description = collapseWhitespace($el.find(".block").first().text());

    const notes: Record<string, string[]> = {};
    let currentLabel = "";
    $el
      .find("dl.notes")
      .first()
      .children()
      .each((_, child) => {
        const $child = $(child);
        const tag = (child as { tagName?: string }).tagName?.toLowerCase();
        if (tag === "dt") {
          currentLabel = collapseWhitespace($child.text()).replace(/:$/, "");
        } else if (tag === "dd" && currentLabel) {
          (notes[currentLabel] ??= []).push(collapseWhitespace($child.text()));
        }
      });

    results.push({ name, anchorId, signature, description, notes });
  });

  return results;
}

export function parsePackageClasses(html: string, packageName: string): PackageClassEntry[] {
  const $ = cheerio.load(html);

  return parseTwoColumnSummaryTable($, "#class-summary .summary-table > div").map((row) => {
    const simpleName = row.href ? row.href.replace(/\.html$/, "") : row.text;
    const kind = row.title ? row.title.split(" in ")[0] : "";
    return {
      fullClassName: `${packageName}.${simpleName}`,
      simpleName: row.text,
      kind,
      description: row.description,
    };
  });
}

const DEPRECATED_CATEGORY_IDS = [
  "package",
  "interface",
  "class",
  "enum-class",
  "exception-class",
  "annotation-interface",
  "field",
  "method",
  "constructor",
  "enum-constant",
];

export function parseDeprecatedList(html: string): DeprecatedEntry[] {
  const $ = cheerio.load(html);
  const entries: DeprecatedEntry[] = [];

  for (const category of DEPRECATED_CATEGORY_IDS) {
    const rows = parseTwoColumnSummaryTable($, `#${category} .summary-table > div`);
    for (const row of rows) {
      entries.push({ category, name: row.text, reason: row.description });
    }
  }

  return entries;
}
