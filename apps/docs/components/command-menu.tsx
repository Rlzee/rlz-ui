"use client";

import * as React from "react";
import type { source } from "@/lib/source";
import { useConfig } from "@/hooks/use-config";
import { useIsMac } from "@/hooks/use-is-mac";

import Link from "next/link";
import {
  CommandDialog,
  Command,
  CommandCreateHandle,
} from "@rlz/ui/components/ui/command";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import { CircleDashed, Search, Redo2 } from "lucide-react";

type PageItem = {
  value: string;
  label: string;
  url: string;
  isComponent: boolean;
  keywords?: string[];
};

type PageGroup = {
  value: string;
  items: PageItem[];
};

export const commandHandle = CommandCreateHandle();

export function CommandMenu({
  tree,
  navItems,
  ...props
}: React.ComponentProps<typeof CommandDialog> & {
  tree: typeof source.pageTree;
  navItems?: { href: string; label: string }[];
}) {
  const isMac = useIsMac();
  const [config] = useConfig();
  const [inputValue, setInputValue] = React.useState("");
  const [copyPayload, setCopyPayload] = React.useState("");
  const packageManager = config.packageManager || "pnpm";

  React.useEffect(() => {
    if (!copyPayload) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        navigator.clipboard.writeText(copyPayload);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [copyPayload]);

  // Convert tree structure to grouped items
  const groupedItems = React.useMemo<PageGroup[]>(() => {
    const groups: PageGroup[] = [];

    // Add nav items group
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

    // Add tree groups
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

  const handlePageHighlight = React.useCallback(
    (item: PageItem) => {
      if (item.isComponent) {
        const componentName = item.url.split("/").pop();
        const registryItem = `${componentName}`;
        let cmd: string;
        switch (packageManager) {
          case "pnpm":
            cmd = `pnpm dlx rlz@latest add ${registryItem}`;
            break;
          case "bun":
            cmd = `bunx --bun rlz@latest add ${registryItem}`;
            break;
          case "yarn":
            cmd = `yarn dlx rlz@latest add ${registryItem}`;
            break;
          default:
            cmd = `npx rlz@latest add ${registryItem}`;
        }

        setCopyPayload(cmd);
      } else {
        setCopyPayload("");
      }
    },
    [packageManager]
  );

  return (
    <CommandDialog
      handle={commandHandle}
      onOpenChange={(open) => {
        if (!open) setInputValue("");
      }}
      {...props}
    >
      <CommandDialog.Popup>
        <Command
          items={groupedItems}
          onItemHighlighted={(highlightedValue) => {
            const item = highlightedValue as PageItem | null;
            if (item) {
              handlePageHighlight(item);
            }
          }}
          className="bg-transparent border-0 p-1"
        >
          <InputGroup variant="secondary" className="h-11 bg-[#121212]!">
            <InputGroup.Addon align="inline-start">
              <Search />
            </InputGroup.Addon>

            <Command.Input
              unstyled
              className="text-base"
              placeholder="Search documentation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </InputGroup>

          {inputValue !== "" && (
            <>
              <div className="bg-popover border border-b-0 rounded-b-none rounded-lg mt-2 px-1">
                <Command.Empty>No Results Found.</Command.Empty>

                <Command.List>
                  {(group: PageGroup, _index: number) => (
                    <React.Fragment key={group.value}>
                      <Command.Group items={group.items}>
                        <Command.GroupLabel>{group.value}</Command.GroupLabel>

                        <Command.Collection>
                          {(item: PageItem) => (
                            <Command.Item
                              key={item.value}
                              value={item.value}
                              className="data-highlighted:bg-accent data-highlighted:border rounded-md py-2.5 mx-1"
                              render={
                                <Link
                                  href={item.url}
                                  onNavigate={() => commandHandle.close()}
                                />
                              }
                            >
                              <CircleDashed />
                              <span className="flex-1">{item.label}</span>
                            </Command.Item>
                          )}
                        </Command.Collection>
                      </Command.Group>
                    </React.Fragment>
                  )}
                </Command.List>
              </div>
              <Command.Footer className="border mx-0.4 mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Go to Page</span>
                  <Kbd className="border-0 bg-accent">
                    <Redo2 className="rotate-180" />
                  </Kbd>
                </div>
                {copyPayload && (
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-mono">{copyPayload}</span>
                    <Kbd.Group>
                      <Kbd className="border-0 bg-accent">
                        {isMac ? "⌘" : "Ctrl"}
                      </Kbd>
                      <Kbd className="border-0 bg-accent">C</Kbd>
                    </Kbd.Group>
                  </div>
                )}
              </Command.Footer>
            </>
          )}
        </Command>
      </CommandDialog.Popup>
    </CommandDialog>
  );
}
