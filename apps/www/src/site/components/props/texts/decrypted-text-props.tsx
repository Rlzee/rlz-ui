import { type PropRow } from "@site/types/props";

export const decryptedTextProps: PropRow[] = [
  { prop: "text", type: "string", default: "-", description: "Text to decrypt/reveal." },
  { prop: "speed", type: "number", default: "50", description: "Interval (ms) between scramble updates." },
  { prop: "maxIterations", type: "number", default: "10", description: "Maximum scramble iterations when not sequential." },
  { prop: "sequential", type: "boolean", default: "false", description: "Reveal characters sequentially instead of random iterations." },
  { prop: "revealDirection", type: "'start' | 'end' | 'center'", default: "'start'", description: "Direction used when revealing sequentially." },
  { prop: "useOriginalCharsOnly", type: "boolean", default: "false", description: "When true, scrambled chars will only use characters present in the original text." },
  { prop: "characters", type: "string", default: "'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'", description: "Character set used for scrambling when `useOriginalCharsOnly` is false." },
  { prop: "className", type: "string", default: "''", description: "Classes applied to revealed characters." },
  { prop: "encryptedClassName", type: "string", default: "''", description: "Classes applied to scrambled/encrypted characters while animating." },
  { prop: "parentClassName", type: "string", default: "''", description: "Classes applied to the outer wrapper element." },
  { prop: "animateOn", type: "'view' | 'hover'", default: "'hover'", description: "Trigger mode: animate on hover or when the element enters the viewport ('view')." },
];

export const decryptedCharProps: PropRow[] = [
  { prop: "children", type: "string", default: "-", description: "Rendered character (letter or space)." },
  { prop: "className", type: "string", default: "''", description: "Classes applied to the character element (varies between revealed and encrypted states)." },
];

const decryptedTextPropsExport = {
  main: decryptedTextProps,
  char: decryptedCharProps,
};

export { decryptedTextPropsExport };
