import * as React from "react";
import { PresetContext, type PresetTab } from "../use-preset";

export function PresetProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = React.useState<PresetTab>("base");

  return (
    <PresetContext.Provider value={{ tab, setTab }}>
      {children}
    </PresetContext.Provider>
  );
}
