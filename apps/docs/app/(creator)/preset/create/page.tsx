"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Maximize, SquareMousePointer, Plus } from "lucide-react";

export default function Page() {
  return (
    <Tabs className="flex-1" defaultValue="dashboard">
      <header className="border-b border-border flex items-center justify-between py-2 px-3">
        {/* <h2 className="font-semibold text-lg">Playground</h2> */}
        <Tabs.List className="bg-secondary rounded-md items-center">
          <Button size="sm" className="ml-0.5" variant="outline">
            <Plus />
            Add
          </Button>
          <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
          <Tabs.Tab value="Components">Components</Tabs.Tab>
          <Tabs.Tab value="selected">Selected</Tabs.Tab>
          <Tabs.Indicator className="h-8 mx-0.5" />
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
                <Button variant="ghost" size="sm">
                  <Maximize />
                </Button>
              }
              popupContent="Full screen"
              popupProps={{
                positionerProps: {
                  side: "bottom",
                },
              }}
            />
          </Tooltip.Provider>
        </div>
      </header>
      <Tabs.Panel value="Selected"></Tabs.Panel>
    </Tabs>
  );
}
