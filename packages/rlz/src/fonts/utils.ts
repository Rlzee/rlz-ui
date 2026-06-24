export function getNextImportName(family: string) {
  return family.replaceAll(" ", "_");
}

export function buildGoogleFontImport(family: string) {
  return `@import url("https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@400;500;600;700&display=swap");`;
}
