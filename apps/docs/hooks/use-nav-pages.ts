import * as React from "react";
import type { source } from "@/lib/source";

export type PageItem = {
  value: string;
  label: string;
  url: string;
  isComponent: boolean;
  keywords?: string[];
};

export type PageGroup = {
  value: string;
  items: PageItem[];
};

export function useNavPages(
  tree: typeof source.pageTree,
  navItems?: { href: string; label: string }[]
): PageGroup[] {
  return React.useMemo<PageGroup[]>(() => {
    const groups: PageGroup[] = [];

    if (navItems && navItems.length > 0) {
      groups.push({
        items: navItems.map((item) => ({
          isComponent: false,
          keywords: ["nav", "navigation", item.label.toLowerCase()],
          label: item.label,
          url: item.href,
          value: `Navigation ${item.label}`,
        })),
        value: "Pages",
      });
    }

    tree.children.forEach((group) => {
      if (group.type === "folder") {
        const items: PageItem[] = [];
        group.children.forEach((item) => {
          if (item.type === "page") {
            const isComponent = item.url.includes("/components/");
            const itemName = item.name?.toString() || "";
            items.push({
              isComponent,
              keywords: isComponent ? ["component"] : undefined,
              label: itemName,
              url: item.url,
              value: itemName ? `${group.name} ${itemName}` : "",
            });
          }
        });
        if (items.length > 0) {
          groups.push({
            items,
            value:
              typeof group.name === "string" ? group.name : String(group.name),
          });
        }
      }
    });

    return groups;
  }, [tree, navItems]);
}
