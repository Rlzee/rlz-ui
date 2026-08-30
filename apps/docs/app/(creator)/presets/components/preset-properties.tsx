import { usePreset } from "../use-preset";

import { BaseProperties } from "./base-properties";
import { ColorProperties } from "./color-properties";
import { AnimationProperties } from "./animation-properties";

export function PresetProperties() {
  const { tab } = usePreset();

  return (
    <div
      className="flex flex-col border border-border bg-sidebar-background rounded-lg m-2"
      style={{ width: 470, minWidth: 470 }}
    >
      <div className="min-h-0">
        {tab === "base" && <BaseProperties />}
        {tab === "colors" && <ColorProperties />}
        {tab === "animations" && <AnimationProperties />}
      </div>
    </div>
  );
}
