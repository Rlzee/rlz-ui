"use client";

import type { ComponentType } from "react";

import type { PresetSection } from "@/lib/docs";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

import { BaseProperties } from "./base-properties";
import { ColorProperties } from "./colors-properties";
import { RecommendationsProperties } from "./recommendations-properties";

// Properties editor shown for each Foundation entry of the explorer.
const FOUNDATION_EDITORS: Partial<Record<PresetSection, ComponentType>> = {
  base: BaseProperties,
  colors: ColorProperties,
  recommendations: RecommendationsProperties,
};

export function PropertiesPanel() {
  const [selected] = useSelectedComponent();

  const Editor = selected
    ? FOUNDATION_EDITORS[selected.id as PresetSection]
    : undefined;

  return (
    <aside className="top-(--header-height)! h-[calc(100svh-var(--header-height)-0.5rem)] mb-2 bg-background w-[400px] border border-sidebar-border rounded-md ml-4 flex flex-col">
      <header className="p-2 border-b border-border shrink-0">
        <Breadcrumb>
          <Breadcrumb.List className="gap-1 sm:gap-1">
            {selected ? (
              <>
                <Breadcrumb.Item>{selected.section}</Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <ChevronRight />
                </Breadcrumb.Separator>
                <Breadcrumb.Item className="text-primary">
                  {selected.name}
                </Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item>Nothing selected</Breadcrumb.Item>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
        <div className="grid gap-0 py-3 px-2">
          <h2>{selected?.name ?? "No selection"}</h2>
          <span className="text-xs text-muted-foreground">
            {selected?.description ??
              "Pick an item in the explorer to see its properties."}
          </span>
        </div>
      </header>

      <ScrollArea
        scrollFade
        className="min-h-0 flex-1 **:data-[slot=scroll-area-scrollbar]:hidden"
      >
        {Editor && <Editor />}
      </ScrollArea>
    </aside>
  );
}
