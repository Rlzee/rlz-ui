"use client";

import { slugFromId } from "../../lib/slug";
import type { PlaygroundState } from "../../lib/playground-state";

import { EmptyState } from "./preview-shell";
import { ColorsPreview } from "./colors-preview";
import { BasePreview } from "./base-preview";
import { RecommendationsPreview } from "./recommendations-preview";
import { ComponentExamplesPreview } from "./component-examples-preview";
import { GroupsPreview } from "./groups-preview";

/**
 * First preview of the playground: reflects whatever is selected in the
 * explorer. Foundation entries (Colors, Base, Recommendations) get a bespoke
 * live preview driven by the draft preset, while a selected component renders
 * every one of its examples listed in `demoPaths`.
 */
export function SelectedPreview({ state }: { state: PlaygroundState }) {
  const { selected, preset, dark, edits, groups, selectedGroup } = state;
  if (!selected) {
    return (
      <EmptyState>
        Select an item in the explorer to preview it here.
      </EmptyState>
    );
  }

  switch (selected.id) {
    case "info":
      return (
        <EmptyState>
          Choose a component or a foundation to preview your preset.
        </EmptyState>
      );
    case "groups":
      return (
        <GroupsPreview
          groups={groups}
          selectedId={selectedGroup}
          edits={edits}
        />
      );
    case "colors":
      return <ColorsPreview preset={preset} isDark={dark} />;
    case "base":
      return <BasePreview preset={preset} />;
    case "recommendations":
      return <RecommendationsPreview preset={preset} />;
    default:
      return (
        <ComponentExamplesPreview
          slug={slugFromId(selected.id)}
          edits={edits}
        />
      );
  }
}
