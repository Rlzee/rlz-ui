"use client";

import * as React from "react";
import { useAtom } from "jotai";

import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

import { CollapsibleProperties } from "../colapsible-properties";
import { presetBuilderAtom } from "../../preset-builder";

import { Search } from "lucide-react";

import { ColorRowItem } from "./components/color-row-item";

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
