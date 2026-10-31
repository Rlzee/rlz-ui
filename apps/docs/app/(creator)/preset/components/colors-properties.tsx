"use client";

import * as React from "react";
import { useAtom } from "jotai";

import type { PresetColorToken as ColorRow } from "@rlz/registry";

import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

import { CollapsibleProperties } from "./colapsible-properties";
import { TailwindColorsSelector } from "@/components/tailwind-colors-selector";
import { presetBuilderAtom } from "../preset-builder";

import { Search } from "lucide-react";

const DEFAULT_OPEN = new Set(["primary", "secondary-accent"]);

export function ColorProperties() {
  const [preset, setPreset] = useAtom(presetBuilderAtom);

  const [search, setSearch] = React.useState("");

  const filtered = preset.colors.filter(
    (section) =>
      section.name.toLowerCase().includes(search.toLowerCase()) ||
      section.tokens.some((row) =>
        row.label.toLowerCase().includes(search.toLowerCase())
      )
  );

  function updateColor(
    sectionId: string,
    cssVar: string,
    mode: "light" | "dark",
    value: string
  ) {
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
                      [mode]: { ...token[mode], value },
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
      <div className="px-2 py-3">
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
            <CollapsibleProperties
              name={section.name}
              defaultOpen={DEFAULT_OPEN.has(section.id)}
            >
              <div className="ml-2 mt-0.5 space-y-0.5">
                {section.tokens.map((row) => (
                  <ColorRowItem
                    key={row.cssVar}
                    row={row}
                    onChange={(mode, value) =>
                      updateColor(section.id, row.cssVar, mode, value)
                    }
                  />
                ))}
              </div>
            </CollapsibleProperties>
          </div>
        ))}
      </ScrollArea>
    </section>
  );
}

/**
 * One token, and both of its values at once. A preset decides what a color looks
 * like in the light scheme and what it looks like in the dark one: those are two
 * answers about the draft, not two states of the site, so the panel stopped asking
 * which scheme it was wearing to know which value to show.
 */
function ColorRowItem({
  row,
  onChange,
}: {
  row: ColorRow;
  onChange: (mode: "light" | "dark", value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 rounded px-2 py-1.5">
      <span className="text-xs text-muted-foreground">{row.label}</span>

      <SchemeValue
        scheme="light"
        cssVar={row.cssVar}
        token={row.light}
        onChange={onChange}
      />

      <SchemeValue
        scheme="dark"
        cssVar={row.cssVar}
        token={row.dark}
        onChange={onChange}
      />
    </div>
  );
}

function SchemeValue({
  scheme,
  cssVar,
  token,
  onChange,
}: {
  scheme: "light" | "dark";
  cssVar: string;
  token: ColorRow["light"];
  onChange: (mode: "light" | "dark", value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 shrink-0 text-[11px] text-muted-foreground capitalize">
        {scheme}
      </span>

      <div
        className="size-5 shrink-0 rounded-sm border"
        style={{ background: token.value }}
      />

      <Input
        value={token.value}
        aria-label={`${scheme} value of ${cssVar}`}
        onChange={(e) => onChange(scheme, e.target.value)}
        className="h-7 truncate font-mono text-xs"
      />

      <TailwindColorsSelector
        value={token.value}
        onChange={(value) => onChange(scheme, value)}
      />
    </div>
  );
}
