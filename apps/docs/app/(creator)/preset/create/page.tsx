"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreatorAnimation } from "../components/animation-studio/model";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { Select } from "@rlz/ui/components/ui/select";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { SelectedPreview } from "../components/selected-preview";
import { OpenDocsButton } from "../components/open-docs-button";
import { ModeSwitcher } from "@/components/mode-switcher";
import { useSelectedComponent } from "@/hooks/use-selected-component";
import { slugFromId } from "../lib/slug";
import { PREVIEW_ID } from "../lib/preset-styles";
import { applyCreatorAnimation } from "../lib/animation-apply";
import {
  animationSettingsAtom,
  animationSettingKey,
  animationPhaseAtom,
} from "../lib/animation-state";
import { AnimationStudio } from "../components/animation-studio/studio";
import {
  animationStudioOpenAtom,
  animationPartAtom,
} from "../components/animation-studio/panel-state";
import { classEditorRequestAtom } from "../lib/class-editor-state";
import { ClassEditorPanel } from "../components/class-editor-panel";
import {
  presetBuilderAtom,
  componentEditsAtom,
  setComponentEditAtom,
} from "../preset-builder";
import { Maximize, Minimize, SquareMousePointer, Plus, X } from "lucide-react";

export default function Page() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studioOpen, setStudioOpen] = useAtom(animationStudioOpenAtom);
  const [classRequest, setClassRequest] = useAtom(classEditorRequestAtom);
  const [selected] = useSelectedComponent();
  const slug = selected ? slugFromId(selected.id) : "";
  const [partName] = useAtom(animationPartAtom);
  const [phase, setPhase] = useAtom(animationPhaseAtom);
  const [settings, setSettings] = useAtom(animationSettingsAtom);
  const [applyError, setApplyError] = useState("");
  const [preset, setPreset] = useAtom(presetBuilderAtom);
  const edits = useAtomValue(componentEditsAtom);
  const setComponentEdit = useSetAtom(setComponentEditAtom);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const playground = document.getElementById("playground");
    if (!playground) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void playground.requestFullscreen();
  }, []);

  const closeStudio = () => {
    setApplyError("");
    setStudioOpen(false);
  };
  const closeClasses = () => setClassRequest(null);
  // Class editor takes priority when opened from any properties field.
  const activeTab = classRequest
    ? "classes"
    : studioOpen
    ? "animation"
    : "selected";

  const applyAnimation = (animation: CreatorAnimation) => {
    try {
      if (!slug)
        throw new Error("Select a component before applying an animation.");
      const parts = partsOf(slug);
      const part =
        parts.find((item) => item.name === partName) ??
        parts.find((item) => /popup|content/i.test(item.name)) ??
        parts[0];
      if (!part) throw new Error("This component has no editable parts.");
      const result = applyCreatorAnimation(
        preset,
        edits[slug],
        slug,
        part.name,
        phase,
        animation,
        edits
      );
      setPreset(result.preset);
      setComponentEdit(slug, {
        partClasses: { [part.name]: result.partClasses },
      });
      setSettings((previous) => ({
        ...previous,
        [animationSettingKey(slug, part.name, phase)]: {
          mode: "custom",
          animation: structuredClone(animation),
        },
      }));
      closeStudio();
    } catch (error) {
      setApplyError(
        error instanceof Error ? error.message : "Unable to apply animation."
      );
    }
  };

  return (
    <Tabs
      className="min-h-0 flex-1 gap-0"
      value={activeTab}
      onValueChange={(next) => {
        if (next === "selected") {
          closeClasses();
          closeStudio();
        }
        if (next === "animation") {
          closeClasses();
          setStudioOpen(true);
        }
        if (next === "classes") {
          closeStudio();
        }
      }}
    >
      <header className="shrink-0 border-b border-border flex items-center justify-between py-2 px-3">
        <Tabs.List className="bg-secondary rounded-md items-center">
          <Button size="sm" className="ml-0.5" variant="outline">
            <Plus /> Add
          </Button>
          <Tabs.Tab
            value="selected"
            className={activeTab === "selected" ? "mr-0.5" : ""}
          >
            Selected
          </Tabs.Tab>
          {studioOpen && (
            <Tabs.Tab value="animation" className="gap-1.5 mr-0.5">
              Animation Studio
            </Tabs.Tab>
          )}
          {classRequest && (
            <Tabs.Tab value="classes" className="gap-1.5 mr-0.5">
              Class Editor
            </Tabs.Tab>
          )}
          <Tabs.Indicator className="h-8" />
        </Tabs.List>
        <div className="flex gap-1.5 items-center">
          {activeTab === "animation" ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Phase</span>
                <Select
                  value={phase}
                  onValueChange={(next) => {
                    if (next === "enter" || next === "exit") setPhase(next);
                  }}
                >
                  <Select.Trigger
                    size="xs"
                    className="max-w-20"
                    aria-label="Animation phase"
                  >
                    <Select.Value>
                      {phase === "enter" ? "Enter" : "Exit"}
                    </Select.Value>
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Popup
                    positionerProps={{ align: "end", className: "z-[60]" }}
                  >
                    <Select.List>
                      <Select.Item value="enter">
                        <Select.ItemIndicator />
                        <Select.ItemText>Enter</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="exit">
                        <Select.ItemIndicator />
                        <Select.ItemText>Exit</Select.ItemText>
                      </Select.Item>
                    </Select.List>
                  </Select.Popup>
                </Select>
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Close Animation Studio"
                onClick={closeStudio}
              >
                <X />
              </Button>
            </>
          ) : activeTab === "classes" ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Close Class Editor"
              onClick={closeClasses}
            >
              <X />
            </Button>
          ) : (
            <>
              <OpenInV0Button size="sm" variant="outline" />
              <ModeSwitcher />
              <Tooltip.Provider delay={0} closeDelay={0}>
                <OpenDocsButton />
                <Tooltip
                  triggerRender={
                    <Button variant="ghost" size="sm">
                      <SquareMousePointer />
                    </Button>
                  }
                  popupContent="Inspector"
                  popupProps={{ positionerProps: { side: "bottom" } }}
                />
              </Tooltip.Provider>
            </>
          )}
          <Tooltip.Provider delay={0} closeDelay={0}>
            <Tooltip
              triggerRender={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  aria-label="Toggle full screen"
                >
                  {isFullscreen ? <Minimize /> : <Maximize />}
                </Button>
              }
              popupContent={isFullscreen ? "Exit full screen" : "Full screen"}
              popupProps={{ positionerProps: { side: "bottom" } }}
            />
          </Tooltip.Provider>
        </div>
      </header>
      <Tabs.Panel
        id={PREVIEW_ID}
        value="selected"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <SelectedPreview />
      </Tabs.Panel>
      {studioOpen && (
        <Tabs.Panel
          value="animation"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {applyError && (
            <p role="alert" className="px-4 py-2 text-sm text-destructive">
              {applyError}
            </p>
          )}
          <AnimationStudio
            key={`${slug}:${partName}:${phase}:${studioOpen}`}
            value={
              settings[animationSettingKey(slug, partName, phase)]?.animation
            }
            onCancel={closeStudio}
            onApply={applyAnimation}
          />
        </Tabs.Panel>
      )}
      {classRequest && (
        <Tabs.Panel
          value="classes"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ClassEditorPanel onClose={closeClasses} />
        </Tabs.Panel>
      )}
    </Tabs>
  );
}
