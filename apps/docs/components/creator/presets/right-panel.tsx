"use client";

import * as React from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { OpenInV0Button } from "@/components/open-in-v0-button";

import {
  Fullscreen,
  Globe,
  RefreshCw,
  SquareArrowOutUpRight,
  Scissors,
  X,
} from "lucide-react";

const PREVIEW_TABS = [
  "Custom",
  "Cards",
  "Dashboard",
  "Application",
  "Marketing",
];
type PreviewTabs = (typeof PREVIEW_TABS)[number];

export function RightPanel() {
  const [activeTab, setActiveTab] = React.useState<PreviewTabs>("Custom");

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between gap-1.5 py-2 border-b px-4">
        <Toggle.Group
          value={[activeTab]}
          onValueChange={(values) =>
            setActiveTab((values[0] as PreviewTabs) ?? "Custom")
          }
          className="gap-1.5"
        >
          {PREVIEW_TABS.map((tab) => (
            <Toggle key={tab} value={tab}>
              {tab}
            </Toggle>
          ))}
        </Toggle.Group>

        <div className="flex items-center gap-1.5">
          <OpenInV0Button size="sm" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted hover:text-foreground"
          >
            <Fullscreen />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-0.5 border-b">
        <InputGroup
          className="data-[variant=primary]:bg-transparent border-none"
          focusVisible={false}
        >
          <InputGroup.Addon align="inline-start">
            <Globe />
          </InputGroup.Addon>
          <Input
            unstyled
            placeholder="Enter website URL (e.g. http://localhost:3000/login)"
          />
          <InputGroup.Addon align="inline-end" className="gap-0.5">
            <Button size="icon-sm" variant="ghost">
              <RefreshCw />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <SquareArrowOutUpRight />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>
    </div>
  );
}
