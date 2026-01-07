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
        "text-muted-foreground ml-auto text-sm tracking-widest group-hover/menu-item:text-primary-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
