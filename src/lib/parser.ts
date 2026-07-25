import * as cheerio from "cheerio";
import type { ClassInfo, MethodSummaryEntry } from "../types.js";

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function parseClassPage(html: string): ClassInfo {
  const $ = cheerio.load(html);

  const signature = collapseWhitespace($(".type-signature").first().text());

  // Current PaperMC Javadoc (JDK 17+ style) uses .class-description .block;
  // fall back to the older .description .block in case the site's javadoc version shifts.
  const descriptionEl = $(".class-description .block").first().length
    ? $(".class-description .block").first()
    : $(".description .block").first();
  const description = collapseWhitespace(descriptionEl.text());

  const methods: MethodSummaryEntry[] = [];

  // The summary-table markup is a CSS grid: rows are flattened divs with
  // classes like col-first / col-second / col-last (modifier/type, name+params, description),
  // not <tr> elements, so we group by these column classes instead of table rows.
  let currentReturnType = "";
  let currentSignature = "";

  $("#method-summary-table .summary-table > div").each((_, el) => {
    const $el = $(el);
    const classAttr = $el.attr("class") ?? "";

    if (classAttr.includes("table-header")) {
      return;
    }

    if (classAttr.includes("col-first")) {
      currentReturnType = collapseWhitespace($el.text());
    } else if (classAttr.includes("col-second")) {
      currentSignature = collapseWhitespace($el.text());
    } else if (classAttr.includes("col-last")) {
      const desc = collapseWhitespace($el.text());
      if (currentSignature) {
        methods.push({
          returnType: currentReturnType,
          signature: currentSignature,
          description: desc,
        });
      }
      currentReturnType = "";
      currentSignature = "";
    }
  });

  return { signature, description, methods };
}
