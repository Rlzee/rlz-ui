"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { SelectedPreview } from "../components/selected-preview";
import { Maximize, Minimize, SquareMousePointer, Plus } from "lucide-react";

export default function Page() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep the icon in sync even when the user leaves fullscreen with Esc.
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

  return (
    <Tabs className="min-h-0 flex-1" defaultValue="selected">
      <header className="shrink-0 border-b border-border flex items-center justify-between py-2 px-3">
        {/* <h2 className="font-semibold text-lg">Playground</h2> */}
        <Tabs.List className="bg-secondary rounded-md items-center">
          <Button size="sm" className="ml-0.5" variant="outline">
            <Plus />
            Add
          </Button>
          <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
          <Tabs.Tab value="Components">Components</Tabs.Tab>
          <Tabs.Tab value="selected" className="mr-0.5">Selected</Tabs.Tab>
          <Tabs.Indicator className="h-8" />
        </Tabs.List>
        <div className="flex gap-1.5 items-center">
          <OpenInV0Button size="sm" variant="outline" />
          <Tooltip.Provider delay={0} closeDelay={0}>
            <Tooltip
              triggerRender={
                <Button variant="ghost" size="sm">
                  <SquareMousePointer />
                </Button>
              }
              popupContent="Inspector"
              popupProps={{
                positionerProps: {
                  side: "bottom",
                },
              }}
            />
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
              popupProps={{
                positionerProps: {
                  side: "bottom",
                },
              }}
            />
          </Tooltip.Provider>
        </div>
      </header>
      <Tabs.Panel
        value="selected"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <SelectedPreview />
      </Tabs.Panel>
    </Tabs>
  );
}
