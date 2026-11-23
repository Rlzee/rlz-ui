import {
  EXTRA_APPEARANCE,
  utilityPrefix,
  validExtraValue,
} from "./appearance-options";

export type AppearanceField = { prefix: string; value: string; label: string };

const FAMILIES = [
  ...EXTRA_APPEARANCE.map(({ prefix, label }) => [prefix, label] as const),
  ["text", "Font size"],
  ["font", "Font weight"],
  ["leading", "Line height"],
  ["tracking", "Letter spacing"],
  ["gap-x", "Gap X"],
  ["gap-y", "Gap Y"],
  ["gap", "Gap"],
  ["px", "Padding X"],
  ["py", "Padding Y"],
  ["ps", "Padding Start"],
  ["pe", "Padding End"],
  ["pt", "Padding Top"],
  ["pr", "Padding Right"],
  ["pb", "Padding Bottom"],
  ["pl", "Padding Left"],
  ["p", "Padding"],
  ["m", "Margin"],
  ["mx", "Margin X"],
  ["my", "Margin Y"],
  ["mt", "Margin Top"],
  ["mr", "Margin Right"],
  ["mb", "Margin Bottom"],
  ["ml", "Margin Left"],
  ["ms", "Margin Start"],
  ["me", "Margin End"],
  ["rounded", "Rounded"],
  ["rounded-t", "Rounded Top"],
  ["rounded-r", "Rounded Right"],
  ["rounded-b", "Rounded Bottom"],
  ["rounded-l", "Rounded Left"],
  ["rounded-s", "Rounded Start"],
  ["rounded-e", "Rounded End"],
  ["rounded-tl", "Rounded Top Left"],
  ["rounded-tr", "Rounded Top Right"],
  ["rounded-bl", "Rounded Bottom Left"],
  ["rounded-br", "Rounded Bottom Right"],
  ["rounded-ss", "Rounded SS"],
  ["rounded-se", "Rounded SE"],
  ["rounded-es", "Rounded ES"],
  ["rounded-ee", "Rounded EE"],
] as const;

export type AppearancePrefix = (typeof FAMILIES)[number][0];

export const TYPOGRAPHY_OPTIONS = {
  text: [
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "8xl",
    "9xl",
  ],
  font: [
    "thin",
    "extralight",
    "light",
    "normal",
    "medium",
    "semibold",
    "bold",
    "extrabold",
    "black",
  ],
  leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
  tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
} as const;

export function isTypography(
  prefix: string
): prefix is keyof typeof TYPOGRAPHY_OPTIONS {
  return Object.hasOwn(TYPOGRAPHY_OPTIONS, prefix);
}

// `text-*` and `font-*` also cover colors, alignment and font families.
// Only unambiguous size/weight utilities belong to these appearance fields.
function isTypographyValue(prefix: string, value: string): boolean {
  if (prefix === "leading" || prefix === "tracking") return !!value;
  if (prefix === "text") {
    const size = value.split("/")[0]!;
    return (
      (TYPOGRAPHY_OPTIONS.text as readonly string[]).includes(size) ||
      /^\[(?:length:|(?:\d*\.?\d+)(?:px|rem|em|%|vw|vh)|(?:calc|min|max|clamp)\()/.test(
        size
      ) ||
      size.startsWith("(length:")
    );
  }
  return (
    (TYPOGRAPHY_OPTIONS.font as readonly string[]).includes(value) ||
    /^\[(?:number:|\d+(?:\.\d+)?\])/.test(value) ||
    value.startsWith("(number:")
  );
}

/** Split only on whitespace outside arbitrary-value brackets and quoted strings. */
function splitClasses(classes: string): string[] {
  const tokens: string[] = [];
  let start = -1;
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let i = 0; i < classes.length; i++) {
    const c = classes[i];
    if (start < 0 && /\s/.test(c)) continue;
    if (start < 0) start = i;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (c === quote) quote = "";
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth = Math.max(0, depth - 1);
    else if (/\s/.test(c) && depth === 0) {
      tokens.push(classes.slice(start, i));
      start = -1;
    }
  }
  if (start >= 0) tokens.push(classes.slice(start));
  return tokens;
}

/** Detect variant separators outside arbitrary values, e.g. md:px-4 but not p-[var(--x:y)]. */
function hasVariant(token: string): boolean {
  let depth = 0;
  let escaped = false;
  for (const c of token) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (c === "\\") {
      escaped = true;
      continue;
    }
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth = Math.max(0, depth - 1);
    else if (c === ":" && depth === 0) return true;
  }
  return false;
}

export function isMargin(prefix: string): boolean {
  return /^m[xytrblse]?$/.test(prefix);
}

function familyOf(token: string): AppearanceField | undefined {
  // Negative utilities are editable only for margins.
  const negative = token.startsWith("-");
  if (negative && !/^-m[xytrblse]?-/.test(token)) return;
  // Important and state-specific utilities need their own editor.
  if (hasVariant(token) || token.startsWith("!") || token.startsWith("*"))
    return;
  if (negative) token = token.slice(1);
  let match: AppearanceField | undefined;
  for (const [prefix, label] of FAMILIES) {
    const utility = utilityPrefix(prefix);
    const value =
      token === utility
        ? ""
        : token.startsWith(`${utility}-`)
        ? token.slice(utility.length + 1)
        : undefined;
    if (
      value !== undefined &&
      validExtraValue(prefix, value) &&
      (!isTypography(prefix) || isTypographyValue(prefix, value)) &&
      (!match || prefix.length > match.prefix.length)
    ) {
      match = { prefix, label, value: negative ? `-${value}` : value };
    }
  }
  return match;
}

export function isRounded(prefix: string): boolean {
  return prefix === "rounded" || prefix.startsWith("rounded-");
}

/** Read the last utility of each family: duplicate utilities are surfaced explicitly via conflicts below. */
export function appearanceFields(classes: string): AppearanceField[] {
  const values = new Map<string, string>();
  for (const token of splitClasses(classes)) {
    const hit = familyOf(token);
    if (hit) values.set(hit.prefix, hit.value);
  }
  return FAMILIES.flatMap(([prefix, label]) => {
    const value = values.get(prefix);
    return value === undefined ? [] : [{ prefix, label, value }];
  });
}

const COVERAGE: Record<string, readonly string[]> = {
  ...Object.fromEntries(
    EXTRA_APPEARANCE.map(({ prefix }) => [prefix, [prefix]])
  ),
  border: ["border-t", "border-r", "border-b", "border-l"],
  "border-x": ["border-r", "border-l"],
  "border-y": ["border-t", "border-b"],
  size: ["w", "h"],
  text: ["font-size"],
  font: ["font-weight"],
  leading: ["line-height"],
  tracking: ["letter-spacing"],
  p: ["t", "r", "b", "l"],
  px: ["r", "l"],
  py: ["t", "b"],
  pt: ["t"],
  pr: ["r"],
  pb: ["b"],
  pl: ["l"],
  ps: ["start"],
  pe: ["end"],
  m: ["margin-t", "margin-r", "margin-b", "margin-l"],
  mx: ["margin-r", "margin-l"],
  my: ["margin-t", "margin-b"],
  mt: ["margin-t"],
  mr: ["margin-r"],
  mb: ["margin-b"],
  ml: ["margin-l"],
  ms: ["margin-start"],
  me: ["margin-end"],
  gap: ["x", "y"],
  "gap-x": ["x"],
  "gap-y": ["y"],
  rounded: ["tl", "tr", "bl", "br"],
  "rounded-t": ["tl", "tr"],
  "rounded-r": ["tr", "br"],
  "rounded-b": ["bl", "br"],
  "rounded-l": ["tl", "bl"],
  "rounded-tl": ["tl"],
  "rounded-tr": ["tr"],
  "rounded-bl": ["bl"],
  "rounded-br": ["br"],
  "rounded-s": ["ss", "es"],
  "rounded-e": ["se", "ee"],
  "rounded-ss": ["ss"],
  "rounded-se": ["se"],
  "rounded-es": ["es"],
  "rounded-ee": ["ee"],
};

/** Potential overlap, not an assertion about Tailwind's final CSS precedence. */
export function appearanceConflicts(
  classes: string
): Array<{ first: string; second: string }> {
  const found = splitClasses(classes)
    .map((token) => ({ token, field: familyOf(token) }))
    .filter(
      (entry): entry is { token: string; field: AppearanceField } =>
        !!entry.field
    );
  const conflicts: Array<{ first: string; second: string }> = [];
  for (let i = 0; i < found.length; i++) {
    for (let j = i + 1; j < found.length; j++) {
      const a = COVERAGE[found[i].field.prefix] ?? [];
      const b = COVERAGE[found[j].field.prefix] ?? [];
      if (a.some((side) => b.includes(side)))
        conflicts.push({ first: found[i].token, second: found[j].token });
    }
  }
  return conflicts;
}

/**
 * Update only one exact utility family. Never delete other overlapping families:
 * px-4 + pl-2 can be intentional, and Tailwind precedence isn't source order.
 * An empty value removes the family. Bare `rounded` is preserved when other
 * families are edited; setting `rounded` itself requires an explicit value.
 */
export function setAppearanceValue(
  classes: string,
  prefix: string,
  value: string
): string {
  if (!FAMILIES.some(([name]) => name === prefix)) return classes;
  const trimmed = value.trim();
  if (trimmed && isTypography(prefix) && !isTypographyValue(prefix, trimmed))
    return classes;
  if (trimmed && !validExtraValue(prefix, trimmed)) return classes;
  const replacement = trimmed
    ? isMargin(prefix) && trimmed.startsWith("-")
      ? `-${prefix}-${trimmed.slice(1)}`
      : `${utilityPrefix(prefix)}-${trimmed}`
    : null;
  const result: string[] = [];
  let placed = false;
  for (const token of splitClasses(classes)) {
    if (familyOf(token)?.prefix !== prefix) {
      result.push(token);
      continue;
    }
    if (replacement && !placed) {
      result.push(replacement);
      placed = true;
    }
  }
  if (replacement && !placed) result.push(replacement);
  return result.join(" ");
}
