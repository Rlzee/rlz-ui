"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Select } from "@rlz/ui/components/ui/select";
import { animationLibraryAtom } from "../../state/animation-state";
import { applyGroupAnimationAtom } from "../../state/style-group-actions";
import type { StyleGroup } from "../../lib/style-groups";

export function GroupAnimations({ group }: { group: StyleGroup }) {
  const library = useAtomValue(animationLibraryAtom);
  const apply = useSetAtom(applyGroupAnimationAtom);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      <p className="text-xs text-muted-foreground">
        Apply an existing animation to every member. Create one in a component's
        Animation Studio first, then reuse it here.
      </p>
      {(["enter", "exit"] as const).map((phase) => {
        const saved = group.animations?.[phase];
        const reusable = [
          ...new Map(
            library
              .filter((entry) => entry.phase === phase)
              .map((entry) => [JSON.stringify(entry.animation), entry])
          ).values(),
        ];
        const match = reusable.find(
          (entry) =>
            JSON.stringify(entry.animation) === JSON.stringify(saved?.animation)
        );
        const selected = !saved
          ? "__unchanged"
          : saved.mode === "custom"
          ? match?.key ?? "__saved"
          : `__${saved.mode}`;
        return (
          <div key={phase} className="flex min-w-0 items-center gap-2">
            <span className="w-10 shrink-0 text-xs text-muted-foreground">
              {phase === "enter" ? "Enter" : "Exit"}
            </span>
            <Select
              value={selected}
              onValueChange={(value) => {
                try {
                  if (value === "__unchanged")
                    apply(group.id, phase, undefined);
                  else if (value === "__default")
                    apply(group.id, phase, { mode: "default" });
                  else if (value === "__none")
                    apply(group.id, phase, { mode: "none" });
                  else {
                    const source = reusable.find(
                      (entry) => entry.key === value
                    );
                    if (!source) return;
                    apply(group.id, phase, {
                      mode: "custom",
                      animation: source.animation,
                    });
                  }
                  setError(null);
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Could not apply animation."
                  );
                }
              }}
            >
              <Select.Trigger
                size="xs"
                className="min-w-0 flex-1"
                aria-label={`Shared ${phase} animation`}
              >
                <Select.Value>
                  {!saved
                    ? "Not shared"
                    : saved.mode === "custom"
                    ? saved.animation?.name
                    : saved.mode === "none"
                    ? "None"
                    : "Default"}
                </Select.Value>
                <Select.Icon />
              </Select.Trigger>
              <Select.Popup
                positionerProps={{ align: "start", className: "z-[60]" }}
              >
                <Select.List>
                  <Select.Item value="__unchanged">
                    <Select.ItemIndicator />
                    <Select.ItemText>Not shared (keep current)</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="__default">
                    <Select.ItemIndicator />
                    <Select.ItemText>Restore default</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="__none">
                    <Select.ItemIndicator />
                    <Select.ItemText>None</Select.ItemText>
                  </Select.Item>
                  {selected === "__saved" && (
                    <Select.Item value="__saved">
                      <Select.ItemIndicator />
                      <Select.ItemText>
                        {saved?.animation?.name}
                      </Select.ItemText>
                    </Select.Item>
                  )}
                  {reusable.map((entry) => (
                    <Select.Item key={entry.key} value={entry.key}>
                      <Select.ItemIndicator />
                      <Select.ItemText>{entry.animation.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select>
          </div>
        );
      })}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
