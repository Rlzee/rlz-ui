export const FONT_DEFINITION = {
  geist: {
    type: "sans",
    next: {
      import: "Geist",
      from: "next/font/google",
    },
    vite: {
      package: "@fontsource-variable/geist",
      family: "Geist Variable",
    },
  },
  "geist-mono": {
    type: "mono",
    next: {
      import: "Geist_Mono",
      from: "next/font/google",
    },
    vite: {
      package: "@fontsource-variable/geist-mono",
      family: "Geist Mono Variable",
    },
  },

  inter: {
    type: "sans",
    next: {
      import: "Inter",
      from: "next/font/google",
    },
    vite: {
      package: "@fontsource-variable/inter",
      family: "Inter Variable",
    },
  },

  "jetbrains-mono": {
    type: "mono",
    next: {
      import: "JetBrains_Mono",
      from: "next/font/google",
    },
    vite: {
      package: "@fontsource-variable/jetbrains-mono",
      family: "JetBrains Mono Variable",
    },
  },
} as const;

export type FontKey = keyof typeof FONT_DEFINITION;
