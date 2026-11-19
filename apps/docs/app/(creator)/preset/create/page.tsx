"use client";

import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";

import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { SelectedPreview } from "../components/selected-preview";
import { OpenDocsButton } from "../components/open-docs-button";
import { ModeSwitcher } from "@/components/mode-switcher";
import { PREVIEW_ID } from "../lib/preset-styles";
import { AnimationStudio } from "../components/animation-studio/studio";
import { animationStudioOpenAtom } from "../components/animation-studio/panel-state";
import { Maximize, Minimize, SquareMousePointer, Plus, X } from "lucide-react";

export default function Page() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studioOpen, setStudioOpen] = useAtom(animationStudioOpenAtom);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const playground = document.getElementById("playground");
    if (!playground) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void playground.requestFullscreen();
    }
  }, []);

  const closeStudio = () => setStudioOpen(false);

  return (
    <Tabs
      className="min-h-0 flex-1 gap-0"
      value={studioOpen ? "animation" : "selected"}
      onValueChange={(next) => {
        if (next === "selected") closeStudio();
        if (next === "animation") setStudioOpen(true);
      }}
    >
      <header className="shrink-0 border-b border-border flex items-center justify-between py-2 px-3">
        <Tabs.List className="bg-secondary rounded-md items-center">
          <Button size="sm" className="ml-0.5" variant="outline">
            <Plus />
            Add
          </Button>
          <Tabs.Tab value="selected" className={studioOpen ? "" : "mr-0.5"}>
            Selected
          </Tabs.Tab>
          {studioOpen && (
            <Tabs.Tab value="animation" className="gap-1.5 mr-0.5">
              Animation Studio
            </Tabs.Tab>
          )}
          <Tabs.Indicator className="h-8" />
        </Tabs.List>
        <div className="flex gap-1.5 items-center">
          {studioOpen ? (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Close Animation Studio"
              title="Close Animation Studio without applying"
              onClick={closeStudio}
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
          <AnimationStudio
            onCancel={closeStudio}
            onApply={(animation) => {
              // UI integration only. V7 will persist animations in the preset.
              console.log("Animation created:", animation);
              closeStudio();
            }}
          />
        </Tabs.Panel>
      )}
    </Tabs>
  );
}
