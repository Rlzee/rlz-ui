"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Toaster, anchoredToastManager } from "@rlz/ui/components/ui/toast";

export default function Example() {
  return (
    <Toaster variant="anchored">
      <Button
        variant="outline"
        onClick={(event) =>
          anchoredToastManager.add({
            title: "Changes saved",
            description: "Your preferences have been updated.",
            type: "success",
            positionerProps: {
              anchor: event.currentTarget,
              side: "top",
              sideOffset: 8,
            },
          })
        }
      >
        Show anchored toast
      </Button>
    </Toaster>
  );
}
