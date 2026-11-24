import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";
import type { StyleGroup } from "./style-groups";

export type PlaygroundState = {
  preset: RegistryPreset;
  edits: Record<string, PresetComponentCustomization>;
  selected: { id: string } | null;
  groups: StyleGroup[];
  selectedGroup: string;
  dark: boolean;
};

export const PLAYGROUND_READY = "rlz:playground:ready";
export const PLAYGROUND_STATE = "rlz:playground:state";
