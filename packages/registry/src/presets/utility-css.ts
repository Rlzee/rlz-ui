/** The same class list is used by the Creator export and the installer. */
export function presetUtilityClasses(value: string): string {
  return value
    .replace(/[{}<>;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function presetUtilitiesCss(
  utilities: Record<string, string> = {}
): string {
  const rules = Object.entries(utilities).flatMap(([name, value]) => {
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name)) {
      throw new Error(`Invalid preset utility name: ${name}`);
    }

    const classes = presetUtilityClasses(value);
    return classes ? [`  .${name} {\n    @apply ${classes};\n  }`] : [];
  });

  return rules.length ? `@layer utilities {\n${rules.join("\n\n")}\n}` : "";
}
