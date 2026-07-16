"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { COLOR_SECTIONS, ColorRow } from "@rlz/ui/styles/colors";

import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { CollapsibleItem } from "./collapsible-item";

import { Search } from "lucide-react";

const DEFAULT_OPEN = new Set(["primary", "secondary-accent"]);

export function ColorSection() {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  const filtered = COLOR_SECTIONS.filter(
    (section) =>
      section.name.toLowerCase().includes(search.toLowerCase()) ||
      section.rows.some((row) =>
        row.label.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="px-4 py-3">
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Search />
          </InputGroup.Addon>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colors..."
            unstyled
          />
        </InputGroup>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-4 **:data-[slot=scroll-area-scrollbar]:hidden">
        {filtered.map((section) => (
          <div key={section.id} className="mb-0.5">
            <CollapsibleItem
              triggerName={section.name}
              defaultOpen={DEFAULT_OPEN.has(section.id)}
            >
              <div className="ml-2 mt-0.5 space-y-0.5">
                {section.rows.map((row) => (
                  <ColorRowItem key={row.cssVar} row={row} isDark={isDark} />
                ))}
              </div>
            </CollapsibleItem>
          </div>
        ))}
      </ScrollArea>
    </section>
  );
}

function ColorRowItem({ row, isDark }: { row: ColorRow; isDark: boolean }) {
  const current = isDark ? row.dark : row.light;

  return (
    <div className="group flex items-center gap-2 rounded px-2 py-1.5 text-foreground transition-colors">
      <div
        className="h-6 w-6 shrink-0 rounded-sm border"
        style={{ background: current.swatch }}
      />

      <span className="w-24 shrink-0 text-xs">{row.label}</span>

      <Input value={current.value} className="h-7 truncate font-mono text-xs" />
    </div>
  );
}
