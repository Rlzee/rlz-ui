export const DIR_DEFINITION = {
  components: ["components"],
  hooks: ["hooks"],
  lib: ["lib"],
  // utils: ["utils"],
  // types: ["types"],
} as const;

export type DirKey = keyof typeof DIR_DEFINITION;
