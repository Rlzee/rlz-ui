"use client";

import { useSetAtom } from "jotai";
import { resetPresetAtom } from "../preset-builder";
import { usePreset, type PresetTab } from "../use-preset";

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
  Target,
} from "lucide-react";

type NavTab = {
  icon: React.ReactNode;
  name: string;
  value: PresetTab;
};

const NAV_TABS: NavTab[] = [
  {
    icon: <Baseline />,
    name: "Base",
    value: "base",
  },
  {
    icon: <Palette />,
    name: "Colors",
    value: "colors",
  },
  {
    icon: <Layers />,
    name: "Animations",
    value: "animations",
  },
  // {
  //   icon: <Target />,
  //   name: "Components",
  //   value: "components",
  // },
  {
    icon: <Sparkles />,
    name: "Generate",
    value: "generate",
  },
];

export function PresetSidebar() {
  const resetPreset = useSetAtom(resetPresetAtom);
  const { tab, setTab } = usePreset();

  return (
    <Sidebar className="border-border">
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

                    <Menu.Item onClick={resetPreset}>
                      <RotateCcw />
                      Reset
                    </Menu.Item>
                  </Menu.Group>
                </Menu.Popup>
              </Menu>
            </div>

            <Sidebar.Separator className="mt-3 bg-border" />
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>

      <Sidebar.Body>
        <Sidebar.Group className="pt-0 px-2">
          <Sidebar.GroupLabel>Collection</Sidebar.GroupLabel>

          <SidebarGroupContent>
            <Sidebar.Menu>
              {NAV_TABS.map((item) => (
                <Sidebar.MenuItem key={item.value}>
                  <Sidebar.MenuButton
                    size="sm"
                    isActive={tab === item.value}
                    onClick={() => setTab(item.value)}
                  >
                    {item.icon}
                    {item.name}
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
