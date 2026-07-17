type TypographyRows = {
  headingFont: string;
  bodyFont: string;
  letterSpacing: number;
};

type LayoutRows = {
  radius: number;
  spacing: number;
};

type IconsRows = {
  library: string;
};

export type BaseSection = {
  typography: TypographyRows;
  layout: LayoutRows;
  icons: IconsRows;
};

export const BASE_SECTIONS: BaseSection = {
  typography: {
    headingFont: "Geist Mono",
    bodyFont: "Geist",
    letterSpacing: 0,
  },
  layout: {
    radius: 0.575,
    spacing: 0.25,
  },
  icons: {
    library: "lucide",
  },
} as const;
