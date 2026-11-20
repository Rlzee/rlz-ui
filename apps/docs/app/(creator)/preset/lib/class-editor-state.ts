import { atom } from "jotai";

export type ClassEditorRequest = {
  id: number;
  label: string;
  builtIn: string;
  initial: string;
  status: string;
  onApply: (classes: string) => void;
};

/** Temporary UI state only: never persisted in a preset or localStorage. */
export const classEditorRequestAtom = atom<ClassEditorRequest | null>(null);
