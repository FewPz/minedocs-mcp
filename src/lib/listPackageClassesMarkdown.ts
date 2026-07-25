import { fetchPackageSummaryPage } from "./scraper.js";
import { parsePackageClasses } from "./parser.js";
import { formatPackageClasses } from "./formatter.js";
import { MAX_PACKAGE_LIST_RESULTS } from "../config.js";

export async function listPackageClassesMarkdown(packageName: string): Promise<string> {
  const page = await fetchPackageSummaryPage(packageName);
  if (!page.ok) {
    return page.message;
  }

  const classes = parsePackageClasses(page.html, packageName);
  return formatPackageClasses(packageName, page.url, classes, MAX_PACKAGE_LIST_RESULTS);
}
