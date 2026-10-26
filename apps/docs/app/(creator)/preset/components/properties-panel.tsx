"use client";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { ChevronRight, Target } from "lucide-react";

export function PropertiesPanel() {
  const [selected] = useSelectedComponent();

  return (
    <aside className="top-(--header-height)! h-auto! mb-2 bg-background w-[320px] border border-sidebar-border rounded-md ml-4">
      <header className="p-2 border-b border-border">
        <Breadcrumb>
          <Breadcrumb.List className="gap-1 sm:gap-1">
            <Breadcrumb.Item>Components</Breadcrumb.Item>
            <Breadcrumb.Separator>
              <ChevronRight />
            </Breadcrumb.Separator>
            <Breadcrumb.Item className="text-primary">{selected?.name ?? "Nothing selected"}</Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
          <div className="grid gap-0 py-3 px-2">
            <h2>{selected?.name ?? "No component"}</h2>
            <span className="text-xs text-muted-foreground">
              {selected?.description ??
                "Pick a component in the explorer to see its properties."}
            </span>
          </div>
      </header>
    </aside>
  );
}
