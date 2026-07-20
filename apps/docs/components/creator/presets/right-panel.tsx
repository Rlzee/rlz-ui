"use client";

import * as React from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Tabs } from "@rlz/ui/components/ui/tabs";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Fullscreen, Plus } from "lucide-react";
import { CustomPreview } from "./custom-preview";

const PREVIEW_TABS = ["Custom", "Dashboard"];
type PreviewTabs = (typeof PREVIEW_TABS)[number];

export function RightPanel() {
  const [activeTab, setActiveTab] = React.useState<PreviewTabs>("Custom");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as PreviewTabs)}
      className="flex flex-col flex-1 h-full gap-0"
    >
      <div className="flex items-center justify-between py-2 border-b px-4">
        <Tabs.List>
          {PREVIEW_TABS.map((tab) => (
            <Tabs.Tab key={tab} value={tab}>
              {tab}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator />
          <Button variant="outline" className="ml-1">
            <Plus />
            Add
          </Button>
        </Tabs.List>
        <div className="flex items-center gap-1.5">
          <OpenInV0Button size="sm" variant="outline" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted hover:text-foreground"
          >
            <Fullscreen />
          </Button>
        </div>
      </div>

      <Tabs.Panel value="Custom" className="flex flex-col flex-1 min-h-0 gap-0">
        <CustomPreview />
      </Tabs.Panel>

      <Tabs.Panel value="Dashboard" className="flex-1 min-h-0"></Tabs.Panel>
    </Tabs>
  );
}
