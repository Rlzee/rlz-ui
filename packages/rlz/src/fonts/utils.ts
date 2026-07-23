export function getNextImportName(family: string) {
  return family.replaceAll(" ", "_");
}

export function buildGoogleFontImport(family: string) {
  const googleFamily = family.trim().replace(/\s+/g, "+");

  return `@import url("https://fonts.googleapis.com/css2?family=${googleFamily}:wght@400;500;600;700&display=swap");`;
}
