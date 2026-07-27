"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";

import type { PresetColorToken as ColorRow } from "@rlz/registry";

import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

import { CollapsibleItem } from "./collapsible-item";
import { presetBuilderAtom } from "../preset-builder";

import { Search } from "lucide-react";

const DEFAULT_OPEN = new Set(["primary", "secondary-accent"]);

export function ColorSection() {
  const [preset, setPreset] = useAtom(presetBuilderAtom);

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

  const filtered = preset.colors.filter(
    (section) =>
      section.name.toLowerCase().includes(search.toLowerCase()) ||
      section.tokens.some((row) =>
        row.label.toLowerCase().includes(search.toLowerCase())
      )
  );

  function updateColor(sectionId: string, cssVar: string, value: string) {
    setPreset((prev) => ({
      ...prev,
      colors: prev.colors.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tokens: section.tokens.map((token) =>
                token.cssVar === cssVar
                  ? {
                      ...token,
                      [isDark ? "dark" : "light"]: {
                        ...token[isDark ? "dark" : "light"],
                        value,
                      },
                    }
                  : token
              ),
            }
          : section
      ),
    }));
  }

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
                {section.tokens.map((row) => (
                  <ColorRowItem
                    key={row.cssVar}
                    row={row}
                    isDark={isDark}
                    onChange={(value) =>
                      updateColor(section.id, row.cssVar, value)
                    }
                  />
                ))}
              </div>
            </CollapsibleItem>
          </div>
        ))}
      </ScrollArea>
    </section>
  );
}

function ColorRowItem({
  row,
  isDark,
  onChange,
}: {
  row: ColorRow;
  isDark: boolean;
  onChange: (value: string) => void;
}) {
  const current = isDark ? row.dark : row.light;

  return (
    <div className="group flex items-center gap-2 rounded px-2 py-1.5 transition-colors">
      <div
        className="h-6 w-6 shrink-0 rounded-sm border"
        style={{ background: current.swatch }}
      />

      <span className="w-24 shrink-0 text-xs text-muted-foreground">
        {row.label}
      </span>

      <Input
        value={current.value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 truncate font-mono text-xs"
      />
    </div>
  );
}
