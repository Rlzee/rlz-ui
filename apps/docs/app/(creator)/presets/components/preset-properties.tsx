import { BaseProperties } from "./base-properties";
import { ColorProperties } from "./color-properties";
import { AnimationProperties } from "./animation-properties";

import type { PresetTab } from "../create/layout";

type Props = {
  tab: PresetTab;
};

export function PresetProperties({ tab }: Props) {
  return (
    <div
      className="flex h-screen min-h-0 flex-col border-l border-border"
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
