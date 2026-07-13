"use client";

import * as React from "react";

import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Toggle } from "@rlz/ui/components/ui/toggle";

import { ColorSection } from "./color-section";

import { Search } from "lucide-react";

const NAV_TABS = ["Colors", "Typography", "Animation"] as const;
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

      <div className="py-3 px-4">
        <InputGroup>
          <InputGroup.Addon align="inline-start">
            <Search />
          </InputGroup.Addon>
          <Input placeholder="Search colors..." unstyled />
        </InputGroup>
      </div>

      <ColorSection />
    </div>
  );
}
