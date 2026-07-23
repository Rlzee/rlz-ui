import type { RegistryPresetItem } from "@rlz/registry";

export const defaultPreset: RegistryPresetItem = {
  type: "preset",
  id: "default",
  name: "Rlz/ui",
  version: "1.0.0",
  path: "registry/presets.ts",
  description: "default rlz-ui preset",
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
          dark: { value: "hsl(0, 0%, 0%)", swatch: "#000000" },
          light: { value: "hsl(0, 0%, 98%)", swatch: "#fafafa" },
        },
        {
          label: "Foreground",
          cssVar: "--foreground",
          dark: { value: "oklch(0.985 0 0)", swatch: "#fafafa" },
          light: { value: "oklch(0.145 0 0)", swatch: "#1a1a1a" },
        },
        {
          label: "Primary",
          cssVar: "--primary",
          dark: { value: "hsl(0, 0%, 100%)", swatch: "#ffffff" },
          light: { value: "hsl(0, 0%, 9%)", swatch: "#171717" },
        },
        {
          label: "Primary FG",
          cssVar: "--primary-foreground",
          dark: { value: "oklch(0.205 0 0)", swatch: "#2e2e2e" },
          light: { value: "oklch(0.985 0 0)", swatch: "#fafafa" },
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
          dark: { value: "hsl(0, 0%, 4%)", swatch: "#0a0a0a" },
          light: { value: "hsl(0, 0%, 100%)", swatch: "#ffffff" },
        },
        {
          label: "Secondary FG",
          cssVar: "--secondary-foreground",
          dark: { value: "oklch(0.985 0 0)", swatch: "#fafafa" },
          light: { value: "oklch(0.205 0 0)", swatch: "#2e2e2e" },
        },
        {
          label: "Accent",
          cssVar: "--accent",
          dark: { value: "hsl(0, 0%, 9%)", swatch: "#171717" },
          light: { value: "hsl(0, 0%, 95%)", swatch: "#f2f2f2" },
        },
        {
          label: "Accent FG",
          cssVar: "--accent-foreground",
          dark: { value: "oklch(0.985 0 0)", swatch: "#fafafa" },
          light: { value: "oklch(0.205 0 0)", swatch: "#2e2e2e" },
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
          dark: { value: "hsl(0, 0%, 4%)", swatch: "#0a0a0a" },
          light: { value: "oklch(1 0 0)", swatch: "#ffffff" },
        },
        {
          label: "Card FG",
          cssVar: "--card-foreground",
          dark: { value: "oklch(0.145 0 0)", swatch: "#1a1a1a" },
          light: { value: "oklch(0.145 0 0)", swatch: "#1a1a1a" },
        },
        {
          label: "Popover",
          cssVar: "--popover",
          dark: { value: "hsl(0, 0%, 4%)", swatch: "#0a0a0a" },
          light: { value: "hsl(0, 0%, 100%)", swatch: "#ffffff" },
        },
        {
          label: "Popover FG",
          cssVar: "--popover-foreground",
          dark: { value: "oklch(0.985 0 0)", swatch: "#fafafa" },
          light: { value: "oklch(0.145 0 0)", swatch: "#1a1a1a" },
        },
        {
          label: "Muted",
          cssVar: "--muted",
          dark: { value: "hsl(0, 0%, 63%)", swatch: "#a1a1a1" },
          light: { value: "hsl(0, 0%, 40%)", swatch: "#666666" },
        },
        {
          label: "Muted FG",
          cssVar: "--muted-foreground",
          dark: { value: "oklch(0.708 0 0)", swatch: "#a3a3a3" },
          light: { value: "oklch(0.556 0 0)", swatch: "#757575" },
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
          dark: { value: "hsl(0, 0%, 16%)", swatch: "#292929" },
          light: { value: "hsl(0, 0%, 88%)", swatch: "#e0e0e0" },
        },
        {
          label: "Input",
          cssVar: "--input",
          dark: { value: "hsl(0, 0%, 4%)", swatch: "#0a0a0a" },
          light: { value: "hsl(0, 0%, 100%)", swatch: "#ffffff" },
        },
        {
          label: "Ring",
          cssVar: "--ring",
          dark: { value: "oklch(0.556 0 0)", swatch: "#757575" },
          light: { value: "oklch(0.708 0 0)", swatch: "#a3a3a3" },
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
          dark: { value: "oklch(0.396 0.141 25.72)", swatch: "#7f1d1d" },
          light: { value: "oklch(0.577 0.245 27.33)", swatch: "#dc2626" },
        },
        {
          label: "Destructive FG",
          cssVar: "--destructive-foreground",
          dark: { value: "oklch(0.637 0.237 25.33)", swatch: "#ef4444" },
          light: { value: "oklch(0.577 0.245 27.33)", swatch: "#dc2626" },
        },
        {
          label: "Success",
          cssVar: "--success",
          dark: { value: "oklch(0.7262 0.1805 148.55)", swatch: "#16a34a" },
          light: { value: "oklch(0.7262 0.1805 148.55)", swatch: "#16a34a" },
        },
        {
          label: "Info",
          cssVar: "--info",
          dark: { value: "oklch(0.627 0.2 264.4)", swatch: "#2563eb" },
          light: { value: "oklch(0.627 0.2 264.4)", swatch: "#2563eb" },
        },
        {
          label: "Warning",
          cssVar: "--warning",
          dark: { value: "oklch(0.7924 0.2066 101.27)", swatch: "#ca8a04" },
          light: { value: "oklch(0.7924 0.2066 101.27)", swatch: "#ca8a04" },
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
          dark: { value: "hsl(0, 0%, 4%)", swatch: "#0a0a0a" },
          light: { value: "oklch(1 0 0)", swatch: "#ffffff" },
        },
        {
          label: "Border",
          cssVar: "--sidebar-border",
          dark: { value: "hsl(0, 0%, 10%)", swatch: "#1a1a1a" },
          light: { value: "hsl(0, 0%, 95%)", swatch: "#f2f2f2" },
        },
      ],
    },
  ],

  animations: {},

  recommendations: {
    typography: {
      headingFont: "Geist Mono",
      bodyFont: "Geist",
    },
    icons: {
      library: "lucide",
    },
  },
};
