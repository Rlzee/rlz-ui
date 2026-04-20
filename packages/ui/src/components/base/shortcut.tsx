import * as React from "react";
import { cn } from "@rlz/ui/lib/cn";

export function Shortcut({
  className,
  children,
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="shortcut"
      className={cn(
        "text-muted-foreground/30 ml-auto text-sm tracking-widest",
        className
      )}
    >
      {children}
    </span>
  );
}
