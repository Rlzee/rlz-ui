"use client";

import { useSetAtom } from "jotai";
import type { ComponentType } from "react";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { getCapabilities } from "@/lib/component-capabilities";
import type { DocsNavSection, PresetSection } from "@/lib/docs";
import { BorderFlash } from "@rlz/ui/components/animations/border-flash";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { Button } from "@rlz/ui/components/ui/button";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { ChevronRight, RefreshCw } from "lucide-react";
import { slugFromId } from "../../lib/slug";
import { classEditorRequestAtom } from "../../state/class-editor-state";
import {
  resetComponentEditsAtom,
  resetSectionAtom,
} from "../../state/preset-builder";

import { BaseProperties } from "./base";
import { ColorProperties } from "./colors";
import { ComponentProperties } from "./component";
import { GroupsProperties } from "./groups-properties";
import { InfoProperties } from "./info-properties";
import { RecommendationsProperties } from "./recommendations-properties";

// Properties editor shown for each Foundation entry of the explorer.
const FOUNDATION_EDITORS: Partial<Record<PresetSection, ComponentType>> = {
  info: InfoProperties,
  groups: GroupsProperties,
  base: BaseProperties,
  colors: ColorProperties,
  recommendations: RecommendationsProperties,
};

export function PropertiesPanel({ sections }: { sections: DocsNavSection[] }) {
  const [selected, setSelected] = useSelectedComponent();
  const setClassEditorRequest = useSetAtom(classEditorRequestAtom);
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
  const Editor =
    FoundationEditor ?? (capabilities ? ComponentProperties : undefined);

  const menu =
    selected && slugFromId(selected.id) === "context-menu"
      ? sections
          .flatMap((section) => section.items)
          .find((item) => slugFromId(item.id) === "menu")
      : undefined;

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
    <aside className="relative h-[calc(100svh-var(--header-height)-0.5rem-2px)] bg-background w-100 rounded-l-md md:rounded-none border-r border-transparent flex flex-col">
      <BorderFlash
        border="right"
        animation="top"
        className="pointer-events-none absolute inset-y-0 -right-px z-10"
      />
      <header className="p-2 border-b border-border/60 shrink-0">
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
          <h2 className="text-xl xl:text-2xl font-medium tracking-tight">
            {selected?.name ?? "No selection"}
          </h2>
          <span className="text-sm text-muted-foreground">
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
        ) : menu ? (
          <div className="flex flex-col items-start gap-3 px-4 py-6">
            <p className="text-sm text-muted-foreground">
              ContextMenu uses Menu.Popup directly. Its content is composed of
              Menu components (items, groups, separators…). Edit Menu to style
              those parts. ContextMenu.Trigger is styled separately where it is
              used.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setClassEditorRequest(null);
                setSelected(menu);
              }}
            >
              Edit Menu
              <ChevronRight />
            </Button>
          </div>
        ) : selected ? (
          <p className="px-4 py-6 text-xs text-muted-foreground">
            No editable properties for this item yet.
          </p>
        ) : null}
      </ScrollArea>
    </aside>
  );
}
