"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { tailwindCompletions } from "../lib/tailwind-completions";

const CATEGORIES = [
  "All",
  "Preset color",
  "Spacing",
  "Radius",
  "Typography",
  "Layout",
  "Flexbox",
  "Effects",
  "Variant",
] as const;

export function TailwindClassExplorer({
  colorTokens,
  onInsert,
}: {
  colorTokens: string[];
  onInsert: (value: string) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const items = React.useMemo(
    () => tailwindCompletions(colorTokens),
    [colorTokens]
  );
  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return items
      .filter(
        (item) =>
          (category === "All" || item.category === category) &&
          (!query ||
            item.label.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query))
      )
      .slice(0, 100);
  }, [items, category, search]);

  return (
    <section
      aria-label="Tailwind class explorer"
      className="flex min-h-0 flex-col gap-3"
    >
      <InputGroup>
        <InputGroup.Addon align="inline-start">
          <Search />
        </InputGroup.Addon>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search utilities..."
          aria-label="Search Tailwind classes"
          unstyled
        />
      </InputGroup>

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(String(value))}
        className="min-w-0"
      >
        <Tabs.List className="flex flex-wrap gap-1">
          {CATEGORIES.map((name) => (
            <Tabs.Tab
              key={name}
              value={name}
              className="h-7 rounded-md px-2 text-xs data-active:bg-accent data-active:text-foreground"
            >
              {name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <ScrollArea
        orientation="vertical"
        className="h-64 min-h-0 overflow-hidden rounded-md border border-border/70"
      >
        {filtered.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground">
            No matching classes.
          </p>
        ) : (
          <div>
            {filtered.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => onInsert(item.label)}
                title={item.description}
                className="flex w-full items-center justify-between gap-3 border-b border-border/40 px-3 py-2 text-left last:border-b-0 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs">
                    {item.label}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                {item.token && (
                  <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    token
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      <p className="text-[11px] text-muted-foreground">
        Click a utility to insert it at the editor cursor. Showing up to 100
        matches.
      </p>
    </section>
  );
}
