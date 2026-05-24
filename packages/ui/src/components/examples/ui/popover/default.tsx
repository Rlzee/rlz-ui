"use client";

import { Popover } from "@rlz/ui/components/ui/popover";
import { Button } from "@rlz/ui/components/ui/button";

export default function Particle() {
  return (
    <Popover>
      <Popover.Trigger render={<Button variant="outline" />}>
        Open Popover
      </Popover.Trigger>
      <Popover.Popup className="w-80">
        <Popover.Arrow />
        <Popover.Header>
          <Popover.Title>New message</Popover.Title>
          <Popover.Description>
            Sarah left a comment on your post.
          </Popover.Description>
        </Popover.Header>
        <Popover.Close render={<Button className="w-full mt-3" />}>
          Close
        </Popover.Close>
      </Popover.Popup>
    </Popover>
  );
}
