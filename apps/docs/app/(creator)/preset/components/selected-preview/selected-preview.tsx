"use client";

import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { slugFromId } from "../../lib/slug";

import { EmptyState } from "./components/preview-shell";
import { ColorsPreview } from "./components/colors-preview";
import { BasePreview } from "./components/base-preview";
import { RecommendationsPreview } from "./components/recommendations-preview";
import { ComponentExamplesPreview } from "./components/component-examples-preview";

/**
 * First preview of the playground: reflects whatever is selected in the
 * explorer. Foundation entries (Colors, Base, Recommendations) get a bespoke
 * live preview driven by the draft preset, while a selected component renders
 * every one of its examples listed in `demoPaths`.
 */
export function SelectedPreview() {
  const [selected] = useSelectedComponent();

  return (
    // Internal scroll region, mirroring the properties panel: only the preview
    // body scrolls, the surrounding page stays put.
    <ScrollArea
      scrollFade
      className="min-h-0 flex-1 **:data-[slot=scroll-area-scrollbar]:hidden"
    >
      <PreviewContent selected={selected} />
    </ScrollArea>
  );
}

function PreviewContent({
  selected,
}: {
  selected: ReturnType<typeof useSelectedComponent>[0];
}) {
  if (!selected) {
    return (
      <EmptyState>Select an item in the explorer to preview it here.</EmptyState>
    );
  }

  switch (selected.id) {
    case "colors":
      return <ColorsPreview />;
    case "base":
      return <BasePreview />;
    case "recommendations":
      return <RecommendationsPreview />;
    default:
      return (
        <ComponentExamplesPreview
          slug={slugFromId(selected.id)}
          name={selected.name}
        />
      );
  }
}
