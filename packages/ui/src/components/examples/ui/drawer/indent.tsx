"use client";

import * as React from "react";
import { Drawer } from "@rlz/ui/components/ui/drawer";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLDivElement | null>(null);

  return (
    <Drawer.Provider>
      <div
        ref={setPortalContainer}
        className="[--bleed:3rem] relative overflow-hidden w-full h-full"
      >
        <Drawer.IndentBackground className="border border-dashed bg-secondary" />
        <Drawer.Indent className="flex justify-center items-center h-full">
          <Drawer swipeDirection="down" modal={false} indent>
            <Drawer.Trigger render={<Button variant="outline" />}>
              Open Drawer indent
            </Drawer.Trigger>
            <Drawer.Popup
              portalProps={{
                container: portalContainer,
              }}
            >
              <Drawer.Header className="pb-4">
                <Drawer.Title>Notifications</Drawer.Title>
                <Drawer.Description>
                  You are all caught up. Good job!
                </Drawer.Description>
              </Drawer.Header>
            </Drawer.Popup>
          </Drawer>
        </Drawer.Indent>
      </div>
    </Drawer.Provider>
  );
}
