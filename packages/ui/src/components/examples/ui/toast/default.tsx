"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { Toaster, toastManager } from "@rlz/ui/components/ui/toast";

const types = ["success", "error", "warning", "info", "loading"] as const;

export default function Example() {
  return (
    <Toaster>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toastManager.add({
              title: "Changes saved",
              description: "Your preferences have been updated.",
            })
          }
        >
          Show toast
        </Button>
        {types.map((type) => (
          <Button
            key={type}
            variant="outline"
            onClick={() =>
              toastManager.add({
                title: `${type.charAt(0).toUpperCase()}${type.slice(1)} notification`,
                description: "This notification will close automatically.",
                type,
              })
            }
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            toastManager.add({
              title: "Message archived",
              actionProps: {
                children: "Undo",
                onClick: () =>
                  toastManager.add({ title: "Message restored", type: "success" }),
              },
            })
          }
        >
          With action
        </Button>
      </div>
    </Toaster>
  );
}
