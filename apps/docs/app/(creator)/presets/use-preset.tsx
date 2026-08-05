"use client";

import * as React from "react";

export type PresetTab =
  | "base"
  | "colors"
  | "animations"
  | "components"
  | "generate";

type PresetContextValue = {
  tab: PresetTab;
  setTab: (tab: PresetTab) => void;
};

export const PresetContext = React.createContext<PresetContextValue | null>(
  null
);

export function usePreset() {
  const context = React.useContext(PresetContext);

  if (!context) {
    throw new Error("usePreset must be used inside PresetProvider");
  }

  return context;
}
