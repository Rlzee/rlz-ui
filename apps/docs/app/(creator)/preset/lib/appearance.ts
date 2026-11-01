// The design system sizes a box with raw Tailwind utilities written straight in
// its classes (`px-6`, `gap-2`, `rounded-lg`). The Appearance section reads those
// back as named fields, so the Creator tunes padding, gap and radius without
// editing the whole class string. A utility is recognised by its prefix only when
// the token continues with `-` (`px-6` is `px`, `pyramid` and `md:px-6` are not),
// and a bare `rounded` reads as radius with no scale.

export type AppearanceField = {
  /** the utility family it edits: `px`, `gap`, `rounded`... */
  prefix: string;
  /** what the field shows and edits: the token after the prefix (`6`, `lg`) */
  value: string;
  label: string;
};

// Order decides both detection (a longer prefix is checked before its shorter
// parent) and the order the fields are listed.
const FAMILIES: { prefix: string; label: string }[] = [
  { prefix: "gap-x", label: "Gap X" },
  { prefix: "gap-y", label: "Gap Y" },
  { prefix: "gap", label: "Gap" },
  { prefix: "px", label: "Padding X" },
  { prefix: "py", label: "Padding Y" },
  { prefix: "ps", label: "Padding Start" },
  { prefix: "pe", label: "Padding End" },
  { prefix: "pt", label: "Padding Top" },
  { prefix: "pr", label: "Padding Right" },
  { prefix: "pb", label: "Padding Bottom" },
  { prefix: "pl", label: "Padding Left" },
  { prefix: "p", label: "Padding" },
  { prefix: "rounded", label: "Radius" },
];

// The family one token belongs to, with the scale that follows it ("" when the
// utility carries none, as a bare `rounded` does).
function familyOf(token: string) {
  // Variant-prefixed utilities (`md:px-6`, `data-...:rounded`) are not a box's
  // static size: they only fire in a state, so Appearance leaves them alone.
  if (token.includes(":")) return undefined;

  for (const family of FAMILIES) {
    if (token === family.prefix) return { ...family, value: "" };

    if (token.startsWith(`${family.prefix}-`)) {
      return { ...family, value: token.slice(family.prefix.length + 1) };
    }
  }

  return undefined;
}

/**
 * The padding/gap/radius fields a class string exposes, always in the fixed
 * family order. Listing them by the utility's position in the string would make
 * the Creator rows jump when an edit moves that token, so the order here is tied
 * to `FAMILIES`, never to the class string.
 */
export function appearanceFields(classes: string): AppearanceField[] {
  const valueByPrefix = new Map<string, string>();

  for (const token of classes.split(/\s+/)) {
    const hit = familyOf(token);

    if (!hit || valueByPrefix.has(hit.prefix)) continue;

    valueByPrefix.set(hit.prefix, hit.value);
  }

  return FAMILIES.flatMap(({ prefix, label }) => {
    const value = valueByPrefix.get(prefix);

    return value === undefined ? [] : [{ prefix, value, label }];
  });
}

/**
 * Writes one family's value back into a class string, keeping the token in its
 * original slot so the rest of the classes - and the fields' order - never
 * shuffle. An empty value drops the utility, a value for a family the box does
 * not have yet is appended, and duplicates of the family collapse into the edit.
 */
export function setAppearanceValue(
  classes: string,
  prefix: string,
  value: string
): string {
  const trimmed = value.trim();
  const replacement = trimmed === "" ? null : `${prefix}-${trimmed}`;

  let placed = false;

  const kept = classes
    .split(/\s+/)
    .filter(Boolean)
    .reduce<string[]>((tokens, token) => {
      // Leave every other family (colour, layout, ...) exactly where it was.
      if (familyOf(token)?.prefix !== prefix) {
        tokens.push(token);
        return tokens;
      }

      // The first token of this family takes the new value in place; later ones
      // drop, so an accidental `px-2 px-6` becomes a single edited utility.
      if (replacement !== null && !placed) {
        tokens.push(replacement);
        placed = true;
      }

      return tokens;
    }, []);

  if (replacement !== null && !placed) kept.push(replacement);

  return kept.join(" ").replace(/\s+/g, " ").trim();
}
