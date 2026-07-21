export type TypographyConfig = {
  letterSpacing: number;
};

export type LayoutConfig = {
  radius: number;
  spacing: number;
};

export type BaseConfig = {
  typography: TypographyConfig;
  layout: LayoutConfig;
};

export type ColorToken = {
  label: string;
  cssVar: string;
  dark: {
    value: string;
    swatch: string;
  };
  light: {
    value: string;
    swatch: string;
  };
};

export type ColorsConfig = {
  id: string;
  name: string;
  tokens: ColorToken[];
};

export type AnimationConfig = {
  // TODO
};

export type TypographyRecommendationConfig = {
  headingFont: string;
  bodyFont: string;
};

export type IconRecommendationConfig = {
  library: string;
};

export type RecommendationsConfig = {
  typography?: TypographyRecommendationConfig;
  icons?: IconRecommendationConfig;
};

export type Preset = {
  id: string;
  name: string;

  base: BaseConfig;
  colors: ColorsConfig[];
  animations: AnimationConfig[];

  recommendations?: RecommendationsConfig;
};
