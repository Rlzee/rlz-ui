"use client";

import * as React from "react";

import { Tabs } from "@rlz/ui/components/ui/tabs";
import { ColorSection } from "./color-section";
import { BaseSection } from "./base-section";
import { AnimationSection } from "./animation-section";
import { Button } from "@rlz/ui/components/ui/button";
import { RefreshCw } from "lucide-react";

const NAV_TABS = ["Base", "Colors", "Animation"] as const;
type NavTab = (typeof NAV_TABS)[number];

const SECTIONS: Record<NavTab, React.ReactNode> = {
  Base: <BaseSection />,
  Colors: <ColorSection />,
  Animation: <AnimationSection />,
};

export function LeftPanel() {
  const [activeTab, setActiveTab] = React.useState<NavTab>("Base");

  return (
    <div
      className="flex h-full min-h-0 flex-col border-r"
      style={{ width: 470, minWidth: 470 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as NavTab)}
        className="flex h-full min-h-0 flex-col gap-0"
      >
        <Tabs.List className="border-b py-2 px-4">
          {NAV_TABS.map((tab) => (
            <Tabs.Tab key={tab} value={tab}>
              {tab}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator />
        </Tabs.List>

        {NAV_TABS.map((tab) => (
          <Tabs.Panel key={tab} value={tab} className="min-h-0">
            {SECTIONS[tab]}
          </Tabs.Panel>
        ))}
      </Tabs>

      <div className="items-center px-4 py-2 border-t flex shrink-0">
        <Button variant="ghost" size="sm">
          <RefreshCw />
          SYNC
        </Button>
      </div>
    </div>
  );
}
