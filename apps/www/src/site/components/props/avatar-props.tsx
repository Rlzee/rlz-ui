import { type PropRow } from "@site/types/props";

export const avatarProps: PropRow[] = [
  { prop: "src", type: "string", default: "-" },
  { prop: "alt", type: "string", default: "-" },
  { prop: "fallback", type: "string", default: "-" },
  { prop: "size", type: `"sm" | "md" | "lg"`, default: `"md"` },
  { prop: "className", type: "string", default: "-" },
  { prop: "loading", type: `"eager" | "lazy"`, default: `"lazy"` },
];

export const avatarRootProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-" },
  { prop: "className", type: "string", default: "Predefined styles" },
];

export const avatarImageProps: PropRow[] = [
  { prop: "src", type: "string", default: "-" },
  { prop: "alt", type: "string", default: "-" },
  { prop: "className", type: "string", default: "Predefined styles" },
];

export const avatarFallbackProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-" },
  { prop: "className", type: "string", default: "Predefined styles" },
];

const avatarPropsExport = {
  main: avatarProps,
  root: avatarRootProps,
  image: avatarImageProps,
  fallback: avatarFallbackProps,
};

export { avatarPropsExport };
