const SIZE_OPTIONS = [
  "0",
  "4",
  "8",
  "16",
  "32",
  "64",
  "auto",
  "full",
  "screen",
  "min",
  "max",
  "fit",
];
const WIDTH_PRESETS = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
];

const BORDER_WIDTHS = [
  ["border", "Border width"],
  ["border-x", "Border width X"],
  ["border-y", "Border width Y"],
  ["border-t", "Border top width"],
  ["border-r", "Border right width"],
  ["border-b", "Border bottom width"],
  ["border-l", "Border left width"],
  ["border-s", "Border start width"],
  ["border-e", "Border end width"],
] as const;

const EXTRA_APPEARANCE = [
  ...BORDER_WIDTHS.map(([prefix, label]) => ({
    prefix,
    label,
    group: "Border" as const,
    value: "1",
    options: ["0", "1", "2", "4", "8"],
  })),
  {
    prefix: "border-style",
    label: "Border style",
    group: "Border",
    value: "solid",
    options: ["solid", "dashed", "dotted", "double", "hidden", "none"],
  },
  {
    prefix: "w",
    label: "Width",
    group: "Dimensions",
    value: "full",
    options: SIZE_OPTIONS,
  },
  {
    prefix: "h",
    label: "Height",
    group: "Dimensions",
    value: "auto",
    options: SIZE_OPTIONS,
  },
  {
    prefix: "min-w",
    label: "Min width",
    group: "Dimensions",
    value: "0",
    options: ["0", "full", "min", "max", "fit", ...WIDTH_PRESETS],
  },
  {
    prefix: "max-w",
    label: "Max width",
    group: "Dimensions",
    value: "sm",
    options: ["none", "full", "min", "max", "fit", ...WIDTH_PRESETS],
  },
  {
    prefix: "min-h",
    label: "Min height",
    group: "Dimensions",
    value: "0",
    options: SIZE_OPTIONS.filter((value) => value !== "auto"),
  },
  {
    prefix: "max-h",
    label: "Max height",
    group: "Dimensions",
    value: "full",
    options: ["none", ...SIZE_OPTIONS.filter((value) => value !== "auto")],
  },
  {
    prefix: "size",
    label: "Size",
    group: "Dimensions",
    value: "8",
    options: SIZE_OPTIONS.filter((value) => value !== "screen"),
  },
  {
    prefix: "shadow",
    label: "Shadow",
    group: "Effects",
    value: "sm",
    options: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
  },
  {
    prefix: "opacity",
    label: "Opacity (%)",
    group: "Effects",
    value: "100",
    options: [
      "0",
      "5",
      "10",
      "20",
      "25",
      "30",
      "40",
      "50",
      "60",
      "70",
      "75",
      "80",
      "90",
      "95",
      "100",
    ],
  },
  {
    prefix: "text-align",
    label: "Text align",
    group: "Alignment",
    value: "left",
    options: ["left", "center", "right", "justify", "start", "end"],
  },
  {
    prefix: "items",
    label: "Align items",
    group: "Alignment",
    value: "center",
    options: ["start", "end", "center", "baseline", "stretch"],
  },
  {
    prefix: "justify",
    label: "Justify content",
    group: "Alignment",
    value: "center",
    options: [
      "normal",
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch",
    ],
  },
  {
    prefix: "content",
    label: "Align content",
    group: "Alignment",
    value: "center",
    options: [
      "normal",
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "baseline",
      "stretch",
    ],
  },
  {
    prefix: "self",
    label: "Align self",
    group: "Alignment",
    value: "auto",
    options: ["auto", "start", "end", "center", "stretch", "baseline"],
  },
] as const;

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

const RADIUS_OPTIONS = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "full",
];

export type AppearanceProperty = {
  prefix: string;
  label: string;
  group: string;
  value: string;
  options?: readonly string[];
  allowNegative?: boolean;
  allowCustom?: boolean;
  numeric?: boolean;
  placeholder?: string;
};

/** Shared by parsing, rendering and the add-property menu. Order is intentional. */
export const APPEARANCE_PROPERTIES: readonly AppearanceProperty[] = [
  ...EXTRA_APPEARANCE.map((field) => ({
    ...field,
    allowCustom: field.group !== "Alignment" && field.prefix !== "border-style",
    placeholder:
      field.group === "Dimensions"
        ? "64, 1/2, [320px] or [24rem]"
        : field.group === "Border"
        ? "3, [1.5px] or [length:var(--border-width)]"
        : "Custom Tailwind value",
  })),
  ...(
    [
      ["text", "Font size", "sm"],
      ["font", "Font weight", "normal"],
      ["leading", "Line height", "normal"],
      ["tracking", "Letter spacing", "normal"],
    ] as const
  ).map(([prefix, label, value]) => ({
    prefix,
    label,
    value,
    group: "Typography",
    options: TYPOGRAPHY_OPTIONS[prefix],
    placeholder:
      prefix === "text"
        ? "[14px] or [length:var(--text-size)]"
        : "Custom Tailwind value",
  })),
  ...(
    [
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
    ] as const
  ).map(([prefix, label]) => ({
    prefix,
    label,
    group: prefix.startsWith("gap") ? "Gap" : "Padding",
    value: prefix.startsWith("gap") ? "2" : "4",
  })),
  ...(
    [
      ["m", "Margin"],
      ["mx", "Margin X"],
      ["my", "Margin Y"],
      ["mt", "Margin Top"],
      ["mr", "Margin Right"],
      ["mb", "Margin Bottom"],
      ["ml", "Margin Left"],
      ["ms", "Margin Start"],
      ["me", "Margin End"],
    ] as const
  ).map(([prefix, label]) => ({
    prefix,
    label,
    group: "Margin",
    value: "4",
    options: ["auto"],
    numeric: true,
    allowNegative: true,
    placeholder: "-2, 1.5, [12px] or (--spacing)",
  })),
  ...(
    [
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
    ] as const
  ).map(([prefix, label]) => ({
    prefix,
    label,
    group: "Border",
    value: "lg",
    options: RADIUS_OPTIONS,
    placeholder: "[0.6rem] or (--radius)",
  })),
];

export const APPEARANCE_GROUPS = [
  ...new Set(APPEARANCE_PROPERTIES.map(({ group }) => group)),
];

export function appearanceProperty(prefix: string) {
  return APPEARANCE_PROPERTIES.find((field) => field.prefix === prefix);
}

export function numericAppearanceValue(
  value: string,
  allowNegative = false
): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && (allowNegative || parsed >= 0)
    ? parsed
    : null;
}

export function utilityPrefix(prefix: string) {
  if (prefix === "text-align") return "text";
  if (prefix === "border-style") return "border";
  return prefix;
}

export function validExtraValue(prefix: string, value: string): boolean {
  const field = EXTRA_APPEARANCE.find((field) => field.prefix === prefix);
  if (!field) return true;
  if ((field.options as readonly string[]).includes(value)) return true;
  if (field.group === "Border") {
    if (prefix === "border-style") return false;
    // Colors and styles also use border-*; only recognize definite lengths.
    return (
      value === "" ||
      /^\d+$/.test(value) ||
      /^\[(?:length:|-?(?:\d*\.?\d+)(?:px|rem|em|vw|vh|vmin|vmax|cm|mm|in|pt|pc)|0\]|(?:calc|min|max|clamp)\()/.test(
        value
      ) ||
      value.startsWith("(length:")
    );
  }
  if (prefix === "shadow") {
    // Shadow colors use the same prefix; leave those utilities untouched.
    return (
      value === "" ||
      /^\[(?:-?\d|length:|(?:var|calc)\()/.test(value) ||
      value.startsWith("(--")
    );
  }
  if (field.group === "Alignment") return false;
  if (prefix === "opacity") {
    return (
      (/^\d+(?:\.\d+)?$/.test(value) && Number(value) <= 100) ||
      value.startsWith("[") ||
      value.startsWith("(")
    );
  }
  return (
    /^\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?$/.test(value) ||
    value.startsWith("[") ||
    value.startsWith("(")
  );
}
