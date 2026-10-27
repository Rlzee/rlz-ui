"use client";

import { useSelectedComponent } from "@/hooks/use-selected-component";
import { Breadcrumb } from "@rlz/ui/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

export function PropertiesPanel() {
  const [selected] = useSelectedComponent();

  return (
    <aside className="top-(--header-height)! h-auto! mb-2 bg-background w-[320px] border border-sidebar-border rounded-md ml-4">
      <header className="p-2 border-b border-border">
        <Breadcrumb>
          <Breadcrumb.List className="gap-1 sm:gap-1">
            {selected ? (
              <>
                <Breadcrumb.Item>{selected.section}</Breadcrumb.Item>
                <Breadcrumb.Separator>
                  <ChevronRight />
                </Breadcrumb.Separator>
                <Breadcrumb.Item className="text-primary">
                  {selected.name}
                </Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item>Nothing selected</Breadcrumb.Item>
            )}
          </Breadcrumb.List>
        </Breadcrumb>
        <div className="grid gap-0 py-3 px-2">
          <h2>{selected?.name ?? "No selection"}</h2>
          <span className="text-xs text-muted-foreground">
            {selected?.description ??
              "Pick an item in the explorer to see its properties."}
          </span>
        </div>
      </header>
    </aside>
  );
}
