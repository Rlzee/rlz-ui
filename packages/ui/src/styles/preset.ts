import { type BaseSection, BASE_SECTIONS } from "./base";
import { type ColorSection, COLOR_SECTIONS } from "./colors";

export type Presets = {
  base: BaseSection;
  colors: ColorSection[];
};

export const DEFAULT_PRESET: Presets = {
  base: BASE_SECTIONS,
  colors: COLOR_SECTIONS,
};
