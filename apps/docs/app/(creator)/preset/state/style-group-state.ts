import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { defaultStyleGroups, type StyleGroup } from "../lib/style-groups";

export const styleGroupsAtom = atomWithStorage<StyleGroup[]>(
  "rlz-style-groups",
  defaultStyleGroups()
);
export const selectedStyleGroupAtom = atom("dialog-popups");
