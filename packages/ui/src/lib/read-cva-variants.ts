/**
 * Best-effort runtime introspection of a `class-variance-authority` function.
 *
 * cva attaches its resolved `config` to the returned function at runtime, but
 * the v0.7 TypeScript surface (`(props?) => string`) does not expose it, so the
 * read is cast. This is intentionally NOT the source of truth for the Creator:
 * the declarative manifest in `../registry/capabilities` is. The helper only
 * seeds new entries and powers the dev-only drift check below.
 */
export function runtimeVariants(
  fn: unknown
): Record<string, string[]> | undefined {
  const config = (fn as { config?: { variants?: Record<string, unknown> } })
    ?.config;

  if (!config?.variants) return undefined;

  const result: Record<string, string[]> = {};

  for (const [name, value] of Object.entries(config.variants)) {
    if (value && typeof value === "object") {
      result[name] = Object.keys(value as Record<string, unknown>);
    }
  }

  return result;
}

/**
 * Warns when the manifest disagrees with what cva actually exposes. Only meant
 * to run in development for cva-backed components; non-cva components (their
 * `detected` argument is undefined) are skipped silently.
 */
export function assertManifestMatchesCva(
  slug: string,
  detected: Record<string, string[]> | undefined,
  declared: Record<string, string[]>
): void {
  if (!detected) return;

  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return;
  }

  for (const [name, values] of Object.entries(detected)) {
    const declaredValues = declared[name];

    if (!declaredValues) {
      console.warn(`[capabilities] ${slug}: cva exposes variant "${name}" but the manifest omits it`);
      continue;
    }

    const missing = values.filter((value) => !declaredValues.includes(value));

    if (missing.length > 0) {
      console.warn(
        `[capabilities] ${slug}: variant "${name}" values missing from manifest: ${missing.join(", ")}`
      );
    }
  }
}
