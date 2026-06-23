export const FONT_CATEGORIES = [
  "sans-serif",
  "serif",
  "display",
  "handwriting",
  "monospace",
] as const;

export type FontCategory = (typeof FONT_CATEGORIES)[number];

export type FontInfo = {
  family: string;
  category: FontCategory;
  variants: string[];
  variable: boolean;
};

export type GoogleFontsResponse = {
  items: {
    family: string;
    category: FontCategory;
    variants: string[];
  }[];
};
