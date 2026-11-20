"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@rlz/ui/components/ui/button";
import { Select } from "@rlz/ui/components/ui/select";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { slugFromId } from "../lib/slug";
import { setPartAnimation } from "../lib/animation-apply";
import {
  animationSettingKey,
  animationSettingsAtom,
  animationPhaseAtom,
  type AnimationMode,
} from "../lib/animation-state";
import {
  componentEditsAtom,
  presetBuilderAtom,
  setComponentEditAtom,
} from "../preset-builder";
import {
  animationStudioOpenAtom,
  animationPartAtom,
} from "./animation-studio/panel-state";
import type { AnimationPhase } from "../lib/animation-compiler";

// Detect native animations from the part's original classes, not from edits.
// Keep this phase-specific so an Exit animation doesn't imply an Enter one.
const PHASE_PREFIX: Record<AnimationPhase, string> = {
  enter: "data-open:",
  exit: "data-ending-style:",
};

function hasNativeAnimation(
  classes: string | undefined,
  phase: AnimationPhase
) {
  const prefix = PHASE_PREFIX[phase];
  return (classes ?? "").split(/\s+/).some((token) => {
    if (!token.startsWith(prefix)) return false;
    const utility = token.slice(prefix.length);
    return /^(?:animate(?:-.+)?|fade-(?:in|out)(?:-.+)?|zoom-(?:in|out)(?:-.+)?|slide-(?:in|out)(?:-.+)?|spin-(?:in|out)(?:-.+)?)$/.test(
      utility
    );
  });
}

export function AnimationProperties() {
  const [selected] = useSelectedComponent();
  const slug = selected ? slugFromId(selected.id) : "";
  const parts = partsOf(slug);
  const [settings, setSettings] = useAtom(animationSettingsAtom);
  const [preset, setPreset] = useAtom(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const setComponentEdit = useSetAtom(setComponentEditAtom);
  const setStudioOpen = useSetAtom(animationStudioOpenAtom);
  const [partName, setPart] = useAtom(animationPartAtom);
  const selectedPart =
    parts.find((part) => part.name === partName) ??
    parts.find((part) => /popup|content/i.test(part.name)) ??
    parts[0];
  const setPhase = useSetAtom(animationPhaseAtom);

  const openStudio = (part: string, phase: AnimationPhase) => {
    setPart(part);
    setPhase(phase);
    setStudioOpen(true);
  };

  const changeMode = (
    part: string,
    phase: AnimationPhase,
    mode: AnimationMode
  ) => {
    const key = animationSettingKey(slug, part, phase);
    const existing = settings[key];
    if (mode === "custom" && !existing?.animation) {
      openStudio(part, phase);
      return;
    }
    const result = setPartAnimation(
      preset,
      edits[slug],
      slug,
      part,
      phase,
      mode,
      existing?.animation
    );
    setPreset(result.preset);
    setComponentEdit(slug, { partClasses: { [part]: result.partClasses } });
    setSettings((previous) => ({
      ...previous,
      [key]: { mode, animation: existing?.animation },
    }));
  };

  if (!parts.length)
    return (
      <p className="px-2 py-2 text-xs text-muted-foreground">
        No editable animation parts.
      </p>
    );

  return (
    <div className="flex flex-col gap-3 px-2 py-2">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs text-muted-foreground">
          Animated part
        </span>
        <Select
          value={selectedPart?.name ?? ""}
          onValueChange={(next) => {
            if (
              typeof next === "string" &&
              parts.some((part) => part.name === next)
            ) {
              setPart(next);
            }
          }}
        >
          <Select.Trigger
            size="xs"
            className="ml-auto min-w-0 max-w-52 flex-1"
            aria-label="Animated part"
          >
            <Select.Value>{selectedPart?.name ?? "Select part"}</Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Popup
            positionerProps={{ align: "start", className: "z-[60]" }}
          >
            <Select.List>
              {parts.map((part) => (
                <Select.Item key={part.name} value={part.name}>
                  <Select.ItemIndicator />
                  <Select.ItemText>{part.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select>
      </div>
      {selectedPart &&
        (["enter", "exit"] as const).map((phase) => {
          const setting =
            settings[animationSettingKey(slug, selectedPart.name, phase)];
          const nativeExists = hasNativeAnimation(selectedPart.classes, phase);
          // No stored choice: derive from native classes for this exact phase.
          // Explicit "none" stays "none", even when native classes exist.
          const mode: AnimationMode =
            setting?.mode ?? (nativeExists ? "default" : "none");
          const canOpenStudio = mode !== "none";
          return (
            <div
              key={`${selectedPart.name}:${phase}`}
              className="flex items-center gap-2"
            >
              <span className="w-10 shrink-0 text-xs text-muted-foreground">
                {phase === "enter" ? "Enter" : "Exit"}
              </span>
              <Select
                value={mode}
                onValueChange={(value) => {
                  if (
                    (value === "default" && nativeExists) ||
                    value === "none" ||
                    value === "custom"
                  ) {
                    changeMode(selectedPart.name, phase, value);
                  }
                }}
              >
                <Select.Trigger
                  size="xs"
                  className="min-w-0 flex-1"
                  aria-label={`${selectedPart.name} ${phase} animation`}
                >
                  <Select.Value>
                    {mode === "default"
                      ? "Default"
                      : mode === "none"
                      ? "None"
                      : "Custom"}
                  </Select.Value>
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popup
                  positionerProps={{ align: "start", className: "z-[60]" }}
                >
                  <Select.List>
                    {nativeExists && (
                      <Select.Item value="default">
                        <Select.ItemIndicator />
                        <Select.ItemText>Default</Select.ItemText>
                      </Select.Item>
                    )}
                    <Select.Item value="none">
                      <Select.ItemIndicator />
                      <Select.ItemText>None</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="custom">
                      <Select.ItemIndicator />
                      <Select.ItemText>Custom</Select.ItemText>
                    </Select.Item>
                  </Select.List>
                </Select.Popup>
              </Select>
              {canOpenStudio && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openStudio(selectedPart.name, phase)}
                >
                  {mode === "custom" && setting?.animation ? "Edit" : "Create"}
                </Button>
              )}
            </div>
          );
        })}
    </div>
  );
}
