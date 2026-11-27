import { atom } from "jotai";
import { defaultStyleGroups, type StyleGroup } from "../lib/style-groups";

export const styleGroupsAtom = atom<StyleGroup[]>(defaultStyleGroups());
export const selectedStyleGroupAtom = atom("dialog-popups");
