import type { RegistryPreset } from "@rlz/registry";

export const testPreset: RegistryPreset = {
  type: "preset",
  id: "test",
  name: "test",
  version: "1.0.0",
  path: "registry/test/preset.test.ts",
  description: "test rlz preset",
  dependencies: [],

  base: {
    typography: {
      letterSpacing: 0,
    },
    layout: {
      radius: 0.575,
      spacing: 0.25,
    },
  },

  colors: [
    {
      id: "primary",
      name: "PRIMARY",
      tokens: [
        {
          label: "Background",
          cssVar: "--background",
          dark: {
            value:
              "color-mix(in srgb, var(--color-neutral-950) 95%, var(--color-white))",
            swatch: "#171717",
          },
          light: {
            value: "var(--color-white)",
            swatch: "#ffffff",
          },
        },
        {
          label: "Foreground",
          cssVar: "--foreground",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
        {
          label: "Primary",
          cssVar: "--primary",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
        {
          label: "Primary FG",
          cssVar: "--primary-foreground",
          dark: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
          light: {
            value: "var(--color-neutral-50)",
            swatch: "#fafafa",
          },
        },
      ],
    },

    {
      id: "secondary-accent",
      name: "SECONDARY & ACCENT",
      tokens: [
        {
          label: "Secondary",
          cssVar: "--secondary",
          dark: {
            value: "--alpha(var(--color-white) / 4%)",
            swatch: "#0a0a0a",
          },
          light: {
            value: "--alpha(var(--color-black) / 4%)",
            swatch: "#f5f5f5",
          },
        },
        {
          label: "Secondary FG",
          cssVar: "--secondary-foreground",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
        {
          label: "Accent",
          cssVar: "--accent",
          dark: {
            value: "--alpha(var(--color-white) / 4%)",
            swatch: "#0a0a0a",
          },
          light: {
            value: "--alpha(var(--color-black) / 4%)",
            swatch: "#f5f5f5",
          },
        },
        {
          label: "Accent FG",
          cssVar: "--accent-foreground",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
      ],
    },

    {
      id: "ui-component",
      name: "UI COMPONENT",
      tokens: [
        {
          label: "Card",
          cssVar: "--card",
          dark: {
            value:
              "color-mix(in srgb, var(--background) 98%, var(--color-white))",
            swatch: "#1a1a1a",
          },
          light: {
            value: "var(--color-white)",
            swatch: "#ffffff",
          },
        },
        {
          label: "Card FG",
          cssVar: "--card-foreground",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
        {
          label: "Popover",
          cssVar: "--popover",
          dark: {
            value:
              "color-mix(in srgb, var(--background) 98%, var(--color-white))",
            swatch: "#1a1a1a",
          },
          light: {
            value: "var(--color-white)",
            swatch: "#ffffff",
          },
        },
        {
          label: "Popover FG",
          cssVar: "--popover-foreground",
          dark: {
            value: "var(--color-neutral-100)",
            swatch: "#f5f5f5",
          },
          light: {
            value: "var(--color-neutral-800)",
            swatch: "#262626",
          },
        },
        {
          label: "Muted",
          cssVar: "--muted",
          dark: {
            value: "--alpha(var(--color-white) / 4%)",
            swatch: "#141414",
          },
          light: {
            value: "--alpha(var(--color-black) / 4%)",
            swatch: "#f5f5f5",
          },
        },
        {
          label: "Muted FG",
          cssVar: "--muted-foreground",
          dark: {
            value:
              "color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-white))",
            swatch: "#858585",
          },
          light: {
            value:
              "color-mix(in srgb, var(--color-neutral-500) 90%, var(--color-black))",
            swatch: "#686868",
          },
        },
      ],
    },

    {
      id: "utility-form",
      name: "UTILITY & FORM",
      tokens: [
        {
          label: "Border",
          cssVar: "--border",
          dark: {
            value: "--alpha(var(--color-white) / 6%)",
            swatch: "#1f1f1f",
          },
          light: {
            value: "--alpha(var(--color-black) / 8%)",
            swatch: "#ebebeb",
          },
        },
        {
          label: "Input",
          cssVar: "--input",
          dark: {
            value: "--alpha(var(--color-white) / 8%)",
            swatch: "#292929",
          },
          light: {
            value: "--alpha(var(--color-black) / 10%)",
            swatch: "#e6e6e6",
          },
        },
        {
          label: "Ring",
          cssVar: "--ring",
          dark: {
            value: "var(--color-neutral-500)",
            swatch: "#737373",
          },
          light: {
            value: "var(--color-neutral-400)",
            swatch: "#a3a3a3",
          },
        },
      ],
    },

    {
      id: "status-feedback",
      name: "STATUS & FEEDBACK",
      tokens: [
        {
          label: "Destructive",
          cssVar: "--destructive",
          dark: {
            value:
              "color-mix(in srgb, var(--color-red-500) 90%, var(--color-white))",
            swatch: "#ef4444",
          },
          light: {
            value: "var(--color-red-500)",
            swatch: "#ef4444",
          },
        },
        {
          label: "Destructive FG",
          cssVar: "--destructive-foreground",
          dark: {
            value: "var(--color-red-400)",
            swatch: "#f87171",
          },
          light: {
            value: "var(--color-red-700)",
            swatch: "#b91c1c",
          },
        },
        {
          label: "Success",
          cssVar: "--success",
          dark: {
            value: "var(--color-emerald-500)",
            swatch: "#10b981",
          },
          light: {
            value: "var(--color-emerald-500)",
            swatch: "#10b981",
          },
        },
        {
          label: "Info",
          cssVar: "--info",
          dark: {
            value: "var(--color-blue-500)",
            swatch: "#3b82f6",
          },
          light: {
            value: "var(--color-blue-500)",
            swatch: "#3b82f6",
          },
        },
        {
          label: "Warning",
          cssVar: "--warning",
          dark: {
            value: "var(--color-amber-500)",
            swatch: "#f59e0b",
          },
          light: {
            value: "var(--color-amber-500)",
            swatch: "#f59e0b",
          },
        },
      ],
    },

    {
      id: "sidebar",
      name: "SIDEBAR",
      tokens: [
        {
          label: "Background",
          cssVar: "--sidebar-background",
          dark: {
            value:
              "color-mix(in srgb, var(--color-neutral-950) 97%, var(--color-white))",
            swatch: "#101010",
          },
          light: {
            value: "var(--color-neutral-50)",
            swatch: "#fafafa",
          },
        },
        {
          label: "Border",
          cssVar: "--sidebar-border",
          dark: {
            value: "--alpha(var(--color-white) / 5%)",
            swatch: "#1b1b1b",
          },
          light: {
            value: "--alpha(var(--color-black) / 6%)",
            swatch: "#f0f0f0",
          },
        },
      ],
    },

    {
      id: "charts",
      name: "CHARTS",
      tokens: [
        {
          label: "Chart 1",
          cssVar: "--chart-1",
          dark: {
            value: "oklch(0.488 0.243 264.376)",
            swatch: "#6366f1",
          },
          light: {
            value: "oklch(0.646 0.222 41.116)",
            swatch: "#f08c46",
          },
        },
        {
          label: "Chart 2",
          cssVar: "--chart-2",
          dark: {
            value: "oklch(0.696 0.17 162.48)",
            swatch: "#35b78a",
          },
          light: {
            value: "oklch(0.6 0.118 184.704)",
            swatch: "#429ca8",
          },
        },
        {
          label: "Chart 3",
          cssVar: "--chart-3",
          dark: {
            value: "oklch(0.769 0.188 70.08)",
            swatch: "#e8b84d",
          },
          light: {
            value: "oklch(0.398 0.07 227.392)",
            swatch: "#24536b",
          },
        },
        {
          label: "Chart 4",
          cssVar: "--chart-4",
          dark: {
            value: "oklch(0.627 0.265 303.9)",
            swatch: "#a855d8",
          },
          light: {
            value: "oklch(0.828 0.189 84.429)",
            swatch: "#e6b94f",
          },
        },
        {
          label: "Chart 5",
          cssVar: "--chart-5",
          dark: {
            value: "oklch(0.645 0.246 16.439)",
            swatch: "#e85b4f",
          },
          light: {
            value: "oklch(0.769 0.188 70.08)",
            swatch: "#e6b94f",
          },
        },
      ],
    },
  ],

  animations: {},

  recommendations: {
    typography: {
      fontSans: "Geist",
      fontHeading: "Geist",
      fontMono: "Geist Mono",
    },
    icons: {
      library: "tabler",
    },
  },
};
