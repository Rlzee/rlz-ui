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
    <Sidebar className="border-border h-[calc(100svh-var(--header-height))] top-(--header-height)">
      <Sidebar.Body>
        <Sidebar.Group className="pt-2 px-2">
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
