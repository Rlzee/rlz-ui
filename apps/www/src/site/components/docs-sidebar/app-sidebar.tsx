"use client";

import { Sidebar } from "@ui/components/sidebar";
import { SeparatorBorder } from "@ui/components/separator-border";
import { ContentSidebar } from "./content-sidebar";
import { type DocsConfig } from "@site/config/docs";

const AppSidebar = ({
  config,
  side,
}: {
  config: DocsConfig;
  side?: "left" | "right";
}) => {
  const data = config.sidebarNav;

  if (side === "right") {
    return (
      <div className="hidden 2xl:flex">
        <SeparatorBorder orientation="vertical" />
        <Sidebar
          collapsible="offcanvas"
          className="pt-16 group-data-[side=right]:border-l-0"
          backgroundColor="bg-background"
          side="right"
        >
          <Sidebar.Content>
            {Object.entries(data.itemsRight).map(([key, items]) => (
              <ContentSidebar key={key} items={items} label={key} />
            ))}
          </Sidebar.Content>
        </Sidebar>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex">
      <Sidebar
        collapsible="offcanvas"
        className="pt-16 group-data-[side=left]:border-r-0"
        backgroundColor="bg-background"
      >
        <Sidebar.Content className="gap-0">
          {Object.entries(data.itemsLeft).map(([key, items]) => (
            <ContentSidebar key={key} items={items} label={key} />
          ))}
        </Sidebar.Content>
      </Sidebar>
      <SeparatorBorder orientation="vertical" />
    </div>
  );
};

export { AppSidebar };
