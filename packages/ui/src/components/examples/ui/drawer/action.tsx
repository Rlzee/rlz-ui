"use client";

import * as React from "react";
import { Drawer } from "@rlz/ui/components/ui/drawer";
import { Button } from "@rlz/ui/components/ui/button";
import { Group } from "@rlz/ui/components/ui/group";

const ACTIONS = [
  "Unfollow",
  "Mute",
  "Add to Favourites",
  "Add to Close Friends",
  "Restrict",
];

export default function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      swipeDirection="down"
      layout="inset"
    >
      <Drawer.Trigger render={<Button variant="outline" />}>
        Open Drawer actions
      </Drawer.Trigger>
      <Drawer.Popup
        className="w-100 gap-2 bg-transparent border-none"
        showCloseButton={false}
        viewportProps={{
          className: "justify-center",
        }}
      >
        <Drawer.Content>
          <Drawer.Title className="sr-only">Profile actions</Drawer.Title>
          <Drawer.Description className="sr-only">
            Choose an action for this user.
          </Drawer.Description>

          <div className="m-0 list-none p-0" aria-label="Profile actions">
            <Group orientation="vertical" className="w-full">
              {ACTIONS.map((action) => (
                <>
                  <Button
                    key={action}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    {action}
                  </Button>
                  {action !== "Restrict" && <Group.Separator />}
                </>
              ))}
            </Group>
          </div>
        </Drawer.Content>
        <div className="pointer-events-auto overflow-hidden w-full">
          <Button variant="destructive" className="w-full" size="lg">
            Block User
          </Button>
        </div>
      </Drawer.Popup>
    </Drawer>
  );
}
