"use client";

import * as React from "react";
import type { source } from "@/lib/source";
import { useConfig } from "@/hooks/use-config";
import { useIsMac } from "@/hooks/use-is-mac";
import {
  useNavPages,
  type PageItem,
  type PageGroup,
} from "@/hooks/use-nav-pages";

import Link from "next/link";
import {
  CommandDialog,
  Command,
  CommandCreateHandle,
} from "@rlz/ui/components/ui/command";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import {
  Target,
  BookOpenText,
  Search,
  Redo2,
  NotepadText,
  NotebookPen,
} from "lucide-react";

export const commandHandle = CommandCreateHandle();

const groupIcons: Record<string, React.ReactNode> = {
  Pages: <NotepadText />,
  Guides: <NotebookPen />,
};

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

  const groupedItems = useNavPages(tree, navItems);

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
          <InputGroup
            variant="secondary"
            className="h-11 dark:bg-[#121212]! bg-[#F2F2F2]!"
            focusVisible={false}
          >
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

                <Command.List className="max-h-50">
                  {(group: PageGroup, _index: number) => (
                    <React.Fragment key={group.value}>
                      <Command.Group items={group.items}>
                        <Command.GroupLabel>{group.value}</Command.GroupLabel>

                        <Command.Collection>
                          {(item: PageItem) => (
                            <Command.Item
                              key={item.value}
                              value={item.value}
                              className="data-highlighted:bg-accent data-highlighted:border rounded-md py-2.5 mx-1 [&_svg]:text-foreground"
                              render={
                                <Link
                                  href={item.url}
                                  onNavigate={() => commandHandle.close()}
                                />
                              }
                            >
                              {groupIcons[group.value] ??
                                (item.isComponent ? (
                                  <Target />
                                ) : (
                                  <BookOpenText />
                                ))}
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
                  <Kbd className="dark:border-0 dark:bg-accent">
                    <Redo2 className="rotate-180" />
                  </Kbd>
                </div>
                {copyPayload && (
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-mono">{copyPayload}</span>
                    <Kbd.Group>
                      <Kbd className="dark:border-0 dark:bg-accent">
                        {isMac ? "⌘" : "Ctrl"}
                      </Kbd>
                      <Kbd className="dark:border-0 dark:bg-accent">C</Kbd>
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
