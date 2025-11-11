import { type PropRow } from "@site/types/props";

export const countNumberProps: PropRow[] = [
  { prop: "to", type: "number", default: "-", description: "Target number to count to." },
  { prop: "from", type: "number", default: "0", description: "Start number. Defaults to 0 (or `to` when direction is 'down')." },
  { prop: "direction", type: "'up' | 'down'", default: "'up'", description: "Direction of the count animation." },
  { prop: "delay", type: "number", default: "0", description: "Delay (in seconds) before the animation starts." },
  { prop: "duration", type: "number", default: "2", description: "Duration (in seconds) of the animation." },
  { prop: "className", type: "string", default: "''", description: "Classes applied to the wrapper element (span)." },
  { prop: "startWhen", type: "boolean", default: "true", description: "If true the animation starts when the element enters the viewport (uses IntersectionObserver)." },
  { prop: "separator", type: "string", default: "''", description: "Optional thousands separator character (replaces \",\")." },
  { prop: "onStart", type: "() => void", default: "undefined", description: "Callback invoked when the animation starts." },
  { prop: "onEnd", type: "() => void", default: "undefined", description: "Callback invoked when the animation ends." },
];

const countNumberPropsExport = {
  main: countNumberProps,
};

export { countNumberPropsExport };
