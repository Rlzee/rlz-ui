"use client";

import * as React from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Empty } from "@rlz/ui/components/ui/empty";
import { CodeBox } from "./code-box";

import {
  Fullscreen,
  Globe,
  RefreshCw,
  SquareArrowOutUpRight,
  Plus,
} from "lucide-react";

const PREVIEW_TABS = ["Custom", "dashboard"];
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
          <Button variant="outline">
            <Plus />
            Add
          </Button>
        </Toggle.Group>

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
            <Button size="icon-xs" variant="ghost">
              <RefreshCw />
            </Button>
            <Button size="icon-xs" variant="ghost">
              <SquareArrowOutUpRight />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto">
        <Empty>
          <Empty.Header className="max-w-md">
            <Empty.Media variant="secondary">
              <Globe />
            </Empty.Media>
            <Empty.Title>Preview your Website in Rlz-ui</Empty.Title>
            <Empty.Description className="text-left">
              <span className="font-medium text-muted">1. </span>Add the script
              below to your website based on your framework
            </Empty.Description>
            <Empty.Description>
              <span className="font-medium text-muted">2. </span>
              Paste your website&apos;s URL (e.g.,{" "}
              <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-accent border">
                http://localhost:3000
              </code>{" "}
              ) above to preview it with the theme applied in real-time
            </Empty.Description>
          </Empty.Header>
          <Empty.Actions>
            <CodeBox />
          </Empty.Actions>
        </Empty>
      </div>
    </div>
  );
}
