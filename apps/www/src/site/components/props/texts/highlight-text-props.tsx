import { type PropRow } from "@site/types/props";

export const highlightTextProps: PropRow[] = [
  { prop: "children", type: "ReactNode", default: "-", description: "Text or elements to render; the content that will receive the highlight." },
  { prop: "color", type: "string", default: "'#ffeb3b'", description: "Background color used for the highlight (CSS color string)." },
  { prop: "delay", type: "number", default: "0", description: "Delay (seconds) before the highlight animation starts (used by the hover variant)." },
  { prop: "duration", type: "number", default: "0.8", description: "Duration (seconds) of the highlight animation." },
  { prop: "animationType", type: "'slideIn' | 'fadeIn' | 'expand' | 'wave'", default: "'slideIn'", description: "Animation variant used to reveal the highlight." },
  { prop: "className", type: "string", default: "''", description: "Additional classes applied to the outer wrapper element." },
  { prop: "style", type: "CSSProperties", default: "-", description: "Inline styles applied to the outer wrapper element." },
];

export const scrollHighlightProps: PropRow[] = [
  { prop: "threshold", type: "number", default: "0.1", description: "Viewport amount (0-1) required before the scroll-triggered highlight runs (used by ScrollHighlight)." },
];

export const controlledHighlightProps: PropRow[] = [
  { prop: "isHighlighted", type: "boolean", default: "false", description: "When true the ControlledHighlight renders the highlight; when false it is disabled." },
];

const highlightTextPropsExport = {
  main: highlightTextProps,
  scroll: { title: "ScrollHighlight", props: scrollHighlightProps },
  controlled: { title: "ControlledHighlight", props: controlledHighlightProps },
};

export { highlightTextPropsExport };
