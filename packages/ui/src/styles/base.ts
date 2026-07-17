type TypographyRows = {
  headingFont: string;
  bodyFont: string;
  letterSpacing: string;
};

type IconsRows = {
  library: string;
};

export type BaseSection = {
  typography: TypographyRows;
  icons: IconsRows;
};

export const BASE_SECTIONS: BaseSection = {
  typography: {
    headingFont: "Geist Mono",
    bodyFont: "Geist",
    letterSpacing: "normal",
  },
  icons: {
    library: "lucide",
  },
} as const;
