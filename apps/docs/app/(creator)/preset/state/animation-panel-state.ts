import { atom } from "jotai";

/** Ephemeral UI state: the Animation Studio is a temporary Playground tab. */
export const animationStudioOpenAtom = atom(false);

/** Shared between the preview's Animated part selector and Apply. */
export const animationPartAtom = atom<string>("");
