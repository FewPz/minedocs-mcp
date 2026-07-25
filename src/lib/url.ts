import { PAPER_JAVADOC_BASE_URL } from "../config.js";

export function classNameToUrl(fullClassName: string): string {
  const path = fullClassName.trim().replace(/\./g, "/");
  return `${PAPER_JAVADOC_BASE_URL}${path}.html`;
}

export function packageNameToUrl(packageName: string): string {
  const path = packageName.trim().replace(/\./g, "/");
  return `${PAPER_JAVADOC_BASE_URL}${path}/package-summary.html`;
}
