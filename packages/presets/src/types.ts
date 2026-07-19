export type TypographyConfig = {
  headingFont: string;
  bodyFont: string;
  letterSpacing: number;
};

export type LayoutConfig = {
  radius: number;
  spacing: number;
};

export type IconsConfig = {
  library: string;
};

export type BaseConfig = {
  typography: TypographyConfig;
  layout: LayoutConfig;
  icons: IconsConfig;
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
  // soon
};

export type Preset = {
  id: string;
  name: string;

  base: BaseConfig;
  colors: ColorsConfig[];
  animations?: AnimationConfig;
};
