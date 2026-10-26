"use client";

import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { ChevronRight, Target } from "lucide-react";

export function PropertiesPanel() {
  return (
    <aside className="top-(--header-height)! h-auto! mb-2 bg-background w-[320px] border border-sidebar-border rounded-md ml-4">
      <header className="p-2 border-b border-border">
        <Breadcrumb>
          <Breadcrumb.List className="gap-1 sm:gap-1">
            <Breadcrumb.Item>Components</Breadcrumb.Item>
            <Breadcrumb.Separator>
              <ChevronRight />
            </Breadcrumb.Separator>
            <Breadcrumb.Item>Button</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <div className="flex items-center gap-1.5 py-3 px-1">
          <div className="bg-secondary border border-border py-1 px-1 rounded-md">
            <Target className="h-8 w-8" />
          </div>
          <div className="grid gap-0">
            <h2>Button</h2>
            <span className="text-xs text-muted-foreground">Reusable interactive element</span>
          </div>
        </div>
      </header>
    </aside>
  );
}
