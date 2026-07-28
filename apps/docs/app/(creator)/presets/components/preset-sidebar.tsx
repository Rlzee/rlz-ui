"use client";

import { Sidebar, SidebarGroupContent } from "@rlz/ui/components/ui/sidebar";
import { Menu } from "@rlz/ui/components/ui/menu";
import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";

import {
  Baseline,
  Palette,
  Layers,
  Sparkles,
  Ellipsis,
  FileDown,
  Share2,
  CloudSync,
  RotateCcw,
} from "lucide-react";

type NavTabs = {
  icon: React.ReactNode;
  name: string;
  isActive?: boolean;
};

const NAV_TABS: NavTabs[] = [
  {
    icon: <Baseline />,
    name: "Base",
    isActive: true,
  },
  {
    icon: <Palette />,
    name: "Colors",
  },
  {
    icon: <Layers />,
    name: "Animations",
  },
];

export function PresetSidebar() {
  return (
    <Sidebar>
      <Sidebar.Header className="pt-2 px-2 pb-1">
        <Sidebar.Menu>
          <Sidebar.MenuItem className="pt-2 px-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-10 place-items-center rounded-md bg-accent text-foreground border">
                  <Sparkles className="h-4 w-4" />
                </div>
                <Input
                  unstyled
                  defaultValue="United Preset"
                  className="text-md h-7"
                />
              </div>
              <Menu>
                <Menu.Trigger
                  render={
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="data-popup-open:bg-accent"
                    />
                  }
                >
                  <Ellipsis />
                </Menu.Trigger>
                <Menu.Popup
                  positionerProps={{
                    align: "start",
                  }}
                >
                  <Menu.Group>
                    <Menu.Item>
                      <CloudSync />
                      Publish
                    </Menu.Item>
                    <Menu.Item>
                      <Share2 />
                      Share
                    </Menu.Item>
                    <Menu.Item>
                      <FileDown />
                      Import
                    </Menu.Item>
                    <Menu.Item>
                      <RotateCcw />
                      Reset
                    </Menu.Item>
                  </Menu.Group>
                </Menu.Popup>
              </Menu>
            </div>
            <Sidebar.Separator className="mt-3" />
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Group className="pt-0 px-2">
          <Sidebar.GroupLabel>Collection</Sidebar.GroupLabel>
          <SidebarGroupContent>
            <Sidebar.Menu>
              {NAV_TABS.map((tab) => (
                <Sidebar.MenuItem key={tab.name}>
                  <Sidebar.MenuButton size="sm" isActive={tab.isActive}>
                    {tab.icon}
                    {tab.name}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </SidebarGroupContent>
        </Sidebar.Group>
      </Sidebar.Body>
    </Sidebar>
  );
}
