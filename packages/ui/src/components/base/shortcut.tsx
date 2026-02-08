import * as React from "react";
import { cn } from "@/lib/utils";

export function Shortcut({
  className,
  children,
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="shortcut"
      className={cn(
        "text-muted-foreground/40 ml-auto text-sm tracking-widest group-hover/menu-item:text-primary-foreground/70",
        className
      )}
    >
      {children}
    </span>
  );
}
