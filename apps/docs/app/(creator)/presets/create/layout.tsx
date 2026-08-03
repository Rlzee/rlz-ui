"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { PresetSidebar } from "../components/preset-sidebar";
import { PresetProperties } from "../components/preset-properties";

export type PresetTab = "base" | "colors" | "animations";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<PresetTab>("base");

  return (
    <SidebarProvider>
      <PresetSidebar tab={tab} onTabChange={setTab} />

      <SidebarInset className="bg-secondary">
        <main className="min-h-screen">{children}</main>
      </SidebarInset>

      <PresetProperties tab={tab} />
    </SidebarProvider>
  );
}
