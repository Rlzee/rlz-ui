"use client";

import * as React from "react";

import { Toggle } from "@rlz/ui/components/ui/toggle";
import { ColorSection } from "./color-section";
import { BaseSection } from "./base-section";
import { AnimationSection } from "./animation-section";

import { RefreshCw } from "lucide-react";
import { Button } from "@rlz/ui/components/ui/button";

const NAV_TABS = ["Base", "Colors", "Animation"] as const;
type NavTab = (typeof NAV_TABS)[number];

export function LeftPanel() {
  const [activeTab, setActiveTab] = React.useState<NavTab>("Colors");

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        width: 470,
        minWidth: 470,
      }}
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

      {activeTab === "Base" && <BaseSection />}
      {activeTab === "Colors" && <ColorSection />}
      {activeTab === "Animation" && <AnimationSection />}

      <div className="flex items-center px-4 py-2 border-t">
        <Button variant="ghost">
          <RefreshCw className="w-3 h-3" />
          SYNC
        </Button>
      </div>
    </div>
  );
}
