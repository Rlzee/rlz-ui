import type * as React from "react";
import { X as XIcon } from "lucide-react";
import { cn } from "cn";

export function XClose({
  label = "Close",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none",
        "data-open:bg-accent data-open:text-muted-foreground",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <XIcon aria-hidden="true" />
    </button>
  );
}
