import type { BaseRegistryItem } from "../types";

export type PresetBaseConfig = {
  typography: {
    letterSpacing: number;
  };
  layout: {
    radius: number;
    spacing: number;
  };
};

export type PresetColorToken = {
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

export type PresetColorConfig = {
  id: string;
  name: string;
  tokens: PresetColorToken[];
};

export type PresetRecommendations = {
  typography?: {
    headingFont: string;
    bodyFont: string;
  };
  icons?: {
    library: string;
  };
};

export type RegistryPreset = BaseRegistryItem & {
  type: "preset";

  base: PresetBaseConfig;
  colors: PresetColorConfig[];

  animations?: Record<string, unknown>;

  recommendations?: PresetRecommendations;
};
