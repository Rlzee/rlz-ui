"use client";

import type { ComponentType } from "react";
import { useSetAtom } from "jotai";

import type { PresetSection } from "@/lib/docs";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import { slugFromId } from "../lib/slug";
import {
  resetComponentEditsAtom,
  resetSectionAtom,
} from "../preset-builder";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { Button } from "@rlz/ui/components/ui/button";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { ChevronRight, RefreshCw } from "lucide-react";

import { InfoProperties } from "./info-properties";
import { BaseProperties } from "./base-properties";
import { ColorProperties } from "./colors-properties";
import { ComponentProperties } from "./component-properties";
import { RecommendationsProperties } from "./recommendations-properties";

// Properties editor shown for each Foundation entry of the explorer.
const FOUNDATION_EDITORS: Partial<Record<PresetSection, ComponentType>> = {
  info: InfoProperties,
  base: BaseProperties,
  colors: ColorProperties,
  recommendations: RecommendationsProperties,
};

export function PropertiesPanel() {
  const [selected] = useSelectedComponent();
  const resetSection = useSetAtom(resetSectionAtom);
  const resetComponentEdits = useSetAtom(resetComponentEditsAtom);

  // Foundation ids (info|base|colors|recommendations) never collide with component
  // ids (MDX URLs), so a component is simply "not a Foundation editor".
  const FoundationEditor = selected
    ? FOUNDATION_EDITORS[selected.id as PresetSection]
    : undefined;

  const capabilities =
    selected && !FoundationEditor
      ? getCapabilities(slugFromId(selected.id))
      : undefined;

  // Components fall back to the generated editor when capabilities are known,
  // and to nothing (handled below) for components without a manifest entry.
  const Editor = FoundationEditor ?? (capabilities ? ComponentProperties : undefined);

  // The panel edits either a Foundation entry or one component, so its Reset follows
  // whichever is selected: Colors goes back to the shipped palette, a component goes
  // back to its built-in classes - the rest of the draft untouched, unlike the Reset
  // in the top bar, which still owns the whole preset.
  const reset = () => {
    if (!selected) return;

    if (FoundationEditor) {
      resetSection(selected.id as PresetSection);
      return;
    }

    resetComponentEdits(slugFromId(selected.id));
  };

  return (
    <aside className="top-(--header-height)! h-[calc(100svh-var(--header-height)-0.5rem)] mb-2 bg-background w-100 border border-sidebar-border rounded-md ml-4 flex flex-col">
      <header className="p-2 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-2">
          <Breadcrumb className="min-w-0">
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

          {Editor && selected ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label={`Reset ${selected.name} properties`}
              title={`Reset ${selected.name} properties`}
              onClick={reset}
            >
              <RefreshCw />
            </Button>
          ) : null}
        </div>
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
        {Editor ? (
          <Editor />
        ) : selected ? (
          <p className="px-4 py-6 text-xs text-muted-foreground">
            No editable properties for this item yet.
          </p>
        ) : null}
      </ScrollArea>
    </aside>
  );
}
