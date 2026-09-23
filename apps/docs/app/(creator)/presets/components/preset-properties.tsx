import { usePreset } from "../use-preset";

import { BaseProperties } from "./base-properties";
import { ColorProperties } from "./color-properties";

export function PresetProperties() {
  const { tab } = usePreset();

  return (
    <div
      className="flex h-full min-h-0 flex-col border-l border-border"
      style={{ width: 470, minWidth: 470 }}
    >
      <div className="min-h-0">
        {tab === "base" && <BaseProperties />}
        {tab === "colors" && <ColorProperties />}
      </div>
    </div>
  );
}
