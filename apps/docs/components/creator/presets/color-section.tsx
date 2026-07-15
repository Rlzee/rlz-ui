"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { COLOR_SECTIONS, ColorRow } from "@rlz/ui/styles/colors";

import { Button } from "@rlz/ui/components/ui/button";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

import { ChevronRight, ChevronDown, Search } from "lucide-react";

export function ColorSection() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = React.useState("");
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(["primary", "secondary-accent"])
  );

  const isDark = theme === "dark";

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = COLOR_SECTIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rows.some((r) => r.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="editor-color" className="flex h-full min-h-0 flex-col">
      <div className="py-3 px-4">
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Search />
          </InputGroup.Addon>
          <Input placeholder="Search colors..." unstyled />
        </InputGroup>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2">
        {filtered.map((section) => {
          const isOpen = expanded.has(section.id);

          return (
            <div key={section.id} className="mb-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full transition-colors justify-start"
                onClick={() => toggle(section.id)}
              >
                {isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {section.name}
              </Button>

              {isOpen && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {section.rows.map((row) => (
                    <ColorRowItem key={row.cssVar} row={row} isDark={isDark} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>
    </section>
  );
}

function ColorRowItem({ row, isDark }: { row: ColorRow; isDark: boolean }) {
  const current = isDark ? row.dark : row.light;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors group text-foreground">
      <div
        className="w-6 h-6 rounded-sm flex shrink-0 border"
        style={{
          background: current.swatch,
        }}
      />
      <span className="text-xs w-24 flex shrink-0">{row.label}</span>
      <Input value={current.value} className="h-7 text-xs truncate font-mono" />
    </div>
  );
}
