import { BaseSection } from "./base-section";

export function PresetProperties() {
  return (
    <div
      className="flex h-screen min-h-0 flex-col border-border border-l"
      style={{ width: 470, minWidth: 470 }}
    >
      <div className="min-h-0">
        <BaseSection />
      </div>
    </div>
  );
}
