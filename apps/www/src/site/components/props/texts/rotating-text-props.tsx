import { type PropRow } from "@site/types/props";

export const rotatingTextProps: PropRow[] = [
  { prop: "texts", type: "string[]", default: "-", description: "Array of strings to rotate through." },
  { prop: "transition", type: "Transition", default: "{ type: 'spring', damping: 25, stiffness: 300 }", description: "Framer Motion transition used for element animations." },
  { prop: "initial", type: "MotionProps['initial']", default: "{ y: '100%', opacity: 0 }", description: "Initial animation state for characters/segments." },
  { prop: "animate", type: "MotionProps['animate']", default: "{ y: 0, opacity: 1 }", description: "Animate state for characters/segments." },
  { prop: "exit", type: "MotionProps['exit']", default: "{ y: '-120%', opacity: 0 }", description: "Exit state for characters/segments when they leave." },
  { prop: "animatePresenceMode", type: "'sync' | 'wait'", default: "'wait'", description: "Mode passed to AnimatePresence (synchronous or wait)." },
  { prop: "animatePresenceInitial", type: "boolean", default: "false", description: "Whether AnimatePresence runs its initial animations." },
  { prop: "rotationInterval", type: "number", default: "2000", description: "Interval (ms) between automatic rotations when `auto` is true." },
  { prop: "staggerDuration", type: "number", default: "0", description: "Delay between staggered character/element animations (seconds)." },
  { prop: "staggerFrom", type: "'first' | 'last' | 'center' | 'random' | number", default: "'first'", description: "Direction or index used to compute staggered delays." },
  { prop: "loop", type: "boolean", default: "true", description: "When true the rotation loops back to the first text after the last." },
  { prop: "auto", type: "boolean", default: "true", description: "When true the component auto-rotates on an interval; set false to control programmatically." },
  { prop: "splitBy", type: "string", default: "'characters'", description: "Splitter used to break text: 'characters', 'words', 'lines' or a custom separator string." },
  { prop: "onNext", type: "(index: number) => void", default: "-", description: "Callback fired when the active index changes (receives the new index)." },
  { prop: "mainClassName", type: "string", default: "-", description: "Classes applied to the outer wrapper element." },
  { prop: "splitLevelClassName", type: "string", default: "-", description: "Classes applied to the split-level wrapper (word/part)." },
  { prop: "elementLevelClassName", type: "string", default: "-", description: "Classes applied to the individual animated elements (characters)." },
];

const rotatingTextPropsExport = {
  main: rotatingTextProps,
};

export { rotatingTextPropsExport };
