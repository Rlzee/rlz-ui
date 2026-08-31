"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@rlz/ui/components/ui/sidebar";
import { Header } from "../components/header";
import { PresetProvider } from "../components/preset-provider";
import { PresetSidebar } from "../components/preset-sidebar";
import { PresetProperties } from "../components/preset-properties";
import { cn } from "@rlz/ui/lib/cn";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PresetProvider>
      <main className="flex h-screen w-screen flex-col overflow-hidden">
        <Header />

        <SidebarProvider className="flex min-h-0 flex-1">
          <PresetSidebar />

          <SidebarInset className="min-h-0 flex-1">
            <div
              className={cn(
                "absolute inset-0",
                "[background-size:20px_20px]",
                "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
              )}
            />
            {children}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
          </SidebarInset>

          <PresetProperties />
        </SidebarProvider>
      </main>
    </PresetProvider>
  );
}
