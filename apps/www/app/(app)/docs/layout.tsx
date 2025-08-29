"use client";

import { AppSidebar } from "@site/components/docs-sidebar/app-sidebar";
import { Sidebar } from "@ui/components/sidebar";
import { Button } from "@ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { docsConfig } from "@site/config/docs";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const title = useMemo(() => {
    if (!pathname || pathname === "/docs") return "Installation";
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  }, [pathname]);

  return (
    <Sidebar.Provider className="min-h-[calc(100vh-56px)]">
      <AppSidebar config={docsConfig} />
      <Sidebar.Inset className="overflow-auto max-h-[calc(100vh-56px)] scrollbar-hide">
        <header className="bg-background/60 backdrop-blur-lg sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-dashed border-border md:px-6 px-4 justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="flex flex-col px-4 sm:px-8 lg:px-24 py-6">{children}</div>
      </Sidebar.Inset>
      <AppSidebar side="right" config={docsConfig} />
    </Sidebar.Provider>
  );
}
