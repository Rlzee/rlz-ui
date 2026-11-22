"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { Select } from "@rlz/ui/components/ui/select";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { SelectedPreview } from "./preview";
import { OpenDocsButton } from "./preview/open-docs-button";
import { ModeSwitcher } from "@/components/mode-switcher";
import { PREVIEW_ID } from "../lib/preset-styles";
import { AnimationStudio } from "./editors/animation-studio/animation-studio";
import { ClassEditorPanel } from "./editors/class-editor/class-editor-panel";
import { usePresetWorkspace } from "../hooks/use-preset-workspace";
import { usePlaygroundFullscreen } from "../hooks/use-playground-fullscreen";
import { Maximize, Minimize, SquareMousePointer, Plus, X } from "lucide-react";

export function PresetWorkspace() {
  const { isFullscreen, toggleFullscreen } = usePlaygroundFullscreen();
  const {
    activeTab,
    changeTab,
    studioOpen,
    classRequest,
    closeStudio,
    closeClasses,
    phase,
    setPhase,
    applyError,
    applyAnimation,
    studioKey,
    animation,
  } = usePresetWorkspace();

  return (
    <Tabs
      className="min-h-0 flex-1 gap-0"
      value={activeTab}
      onValueChange={changeTab}
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
            key={studioKey}
            value={animation}
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
