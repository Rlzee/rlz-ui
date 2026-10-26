import { atom, useAtom } from "jotai";
import type { DocsNavItem } from "@/lib/docs";

// Selected entry of the explorer, shared with the properties panel.
const selectedComponentAtom = atom<DocsNavItem | null>(null);

export function useSelectedComponent() {
  return useAtom(selectedComponentAtom);
}
