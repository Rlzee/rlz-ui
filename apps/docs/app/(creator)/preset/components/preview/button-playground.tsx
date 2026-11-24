"use client";

import type { ComponentProps } from "react";
import type { PresetComponentCustomization } from "@rlz/registry";
import { Button } from "@rlz/ui/components/ui/button";
import {
  playgroundVariant,
  resolvePreviewClasses,
} from "../../lib/playground-component";

type Props = { edit?: PresetComponentCustomization };

export function ButtonPlayground({ edit }: Props) {
  const variant = playgroundVariant("button", "variant", edit);
  const size = playgroundVariant("button", "size", edit);
  const variants = [variant, size];

  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <div className="flex flex-wrap justify-center gap-3">
        {["Default", "Disabled", "Loading"].map((label) => (
          <Button
            key={label}
            variant={variant.native as ComponentProps<typeof Button>["variant"]}
            size={size.native as ComponentProps<typeof Button>["size"]}
            disabled={label === "Disabled"}
            loading={label === "Loading"}
            type="button"
            render={(props) => (
              <button
                {...props}
                className={resolvePreviewClasses(
                  "button",
                  "button",
                  props.className ?? "",
                  edit,
                  variants
                )}
              />
            )}
          >
            {label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {variant.value} · {size.value}
      </p>
    </div>
  );
}
