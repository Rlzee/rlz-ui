export const ICON_LIBS = {
  lucide: {
    package: "lucide-react",
  },
  tabler: {
    package: "@tabler/icons-react",
  },
} as const;

export type IconLib = keyof typeof ICON_LIBS;
