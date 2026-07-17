"use client";

import * as React from "react";

import { Toggle } from "@rlz/ui/components/ui/toggle";
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
      <div className="flex items-center gap-1.5 py-2 border-b px-4">
        <Toggle.Group
          value={[activeTab]}
          onValueChange={(values) =>
            setActiveTab((values[0] as NavTab) ?? "Colors")
          }
          className="gap-1.5"
        >
          {NAV_TABS.map((tab) => (
            <Toggle key={tab} value={tab}>
              {tab}
            </Toggle>
          ))}
        </Toggle.Group>
      </div>

      <div className="flex-1 min-h-0">{SECTIONS[activeTab]}</div>

      <div className="items-center px-4 py-2 border-t flex shrink-0">
        <Button variant="ghost" size="sm">
          <RefreshCw />
          SYNC
        </Button>
      </div>
    </div>
  );
}
