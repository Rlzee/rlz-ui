export const DIR_DEFINITION = {
  components: ["components"],
  utils: ["utils"],
  lib: ["lib"],
  // types: ["types"],
  // hooks: ["hooks"],
  // stores: ["stores"],
} as const;

export type DirKey = keyof typeof DIR_DEFINITION;
