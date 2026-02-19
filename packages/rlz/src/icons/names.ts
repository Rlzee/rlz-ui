export const ICON_NAMES = [
  "check",
  "chevron-right",
  "circle",
  "x",
  "chevron-down",
  "plus",
  "minus",
  "panel-left",
  "circle-alert",
  "circle-check",
  "info",
  "loader-circle",
  "triangle-alert",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
