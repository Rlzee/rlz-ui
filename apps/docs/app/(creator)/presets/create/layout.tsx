"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { Header } from "../components/header";
import { PresetProvider } from "../components/preset-provider";
import { PresetSidebar } from "../components/preset-sidebar";
import { PresetProperties } from "../components/preset-properties";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresetProvider>
      <main className="flex h-screen w-screen flex-col overflow-hidden">
        {/*<Header />*/}

        <SidebarProvider className="flex min-h-0 flex-1">
          <PresetSidebar />

          <SidebarInset className="min-h-0 flex-1">{children}</SidebarInset>

          <PresetProperties />
        </SidebarProvider>
      </main>
    </PresetProvider>
  );
}
