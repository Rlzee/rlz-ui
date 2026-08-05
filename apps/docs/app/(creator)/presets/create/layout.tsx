"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { PresetProvider } from "../components/preset-provider";
import { PresetSidebar } from "../components/preset-sidebar";
import { PresetProperties } from "../components/preset-properties";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PresetProvider>
        <PresetSidebar />

        <SidebarInset className="bg-secondary">
          <main className="min-h-screen">{children}</main>
        </SidebarInset>

        <PresetProperties />
      </PresetProvider>
    </SidebarProvider>
  );
}
