import { type PropRow } from "@site/types/props";

export const shimmerTextProps: PropRow[] = [
  { prop: "children", type: "string", default: "-", description: "Text content to apply the shimmer effect to." },
  { prop: "as", type: "React.ElementType", default: "'p'", description: "Element type to render (e.g., 'p', 'span', 'h1')." },
  { prop: "className", type: "string", default: "''", description: "Additional classes applied to the wrapper element." },
  { prop: "duration", type: "number", default: "2", description: "Animation duration in seconds for the shimmer loop." },
  { prop: "spread", type: "number", default: "2", description: "Multiplier controlling the shimmer spread relative to the text length." },
];

const shimmerTextPropsExport = {
  main: shimmerTextProps,
};

export { shimmerTextPropsExport };
