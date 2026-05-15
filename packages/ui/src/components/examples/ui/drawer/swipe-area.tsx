"use client";

import * as React from "react";
import { Drawer } from "@rlz/ui/components/ui/drawer";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setPortalContainer}
      className="[--bleed:3rem] relative overflow-hidden w-full h-full rounded-t-lg"
    >
      <Drawer variant="bare-top" indent>
        <Drawer.SwipeArea className="border-l border-dashed backdrop-blur-lg w-20 rounded-r-lg">
          <span className="pointer-events-none absolute right-0 top-1/2 mr-2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap text-xs font-bold tracking-[0.12em] text-foreground uppercase">
            Swipe here
          </span>
        </Drawer.SwipeArea>
        <Drawer.Popup
          portalProps={{
            container: portalContainer,
          }}
        >
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.Description>Description</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nisl eget aliquam aliquet, nunc nisl aliquet nisl, eget
            aliquam nisl nisl eget nisl. Sed euismod, nisl eget aliquam aliquet,
            nunc nisl aliquet nisl, eget aliquam nisl nisl eget nisl.
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close render={<Button variant="ghost" />}>
              Cancel
            </Drawer.Close>
            <Button>Save</Button>
          </Drawer.Footer>
        </Drawer.Popup>
      </Drawer>
    </div>
  );
}
