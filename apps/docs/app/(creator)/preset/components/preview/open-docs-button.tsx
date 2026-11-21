"use client";

import { useState } from "react";

import { Button } from "@rlz/ui/components/ui/button";
import { Tooltip } from "@rlz/ui/components/ui/tooltip";
import { Drawer } from "@rlz/ui/components/ui/drawer";

import { BookText } from "lucide-react";

import { useSelectedComponent } from "@/hooks/use-selected-component";

// Component entries of the explorer carry their docs page URL as id.
const COMPONENT_DOCS_PREFIX = "/docs/components/";

/**
 * Opens a drawer showing the docs of the selected component. The docs page is
 * rendered server-side, so it is embedded through an iframe. Hidden entirely
 * when the selection is not a documented component (Foundation or base
 * primitives), since those have no docs page to show.
 */
export function OpenDocsButton() {
  const [selected] = useSelectedComponent();
  const [open, setOpen] = useState(false);

  const docsUrl = selected?.id.startsWith(COMPONENT_DOCS_PREFIX)
    ? selected.id
    : null;

  if (!docsUrl || !selected) {
    return null;
  }

  return (
    <>
      <Tooltip
        triggerRender={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="Open docs"
          >
            <BookText />
          </Button>
        }
        popupContent="Open Docs"
        popupProps={{
          positionerProps: {
            side: "bottom",
          },
        }}
      />

      <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
        <Drawer.Popup className="data-[swipe-direction=right]:max-w-3xl">
          <Drawer.Header>
            <Drawer.Title>{selected.name}</Drawer.Title>
            {selected.description && (
              <Drawer.Description>{selected.description}</Drawer.Description>
            )}
          </Drawer.Header>

          <iframe
            src={docsUrl}
            title={`${selected.name} documentation`}
            className="min-h-0 w-full flex-1 border-0"
          />
        </Drawer.Popup>
      </Drawer>
    </>
  );
}
