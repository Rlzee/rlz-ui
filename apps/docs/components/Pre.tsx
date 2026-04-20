import type * as React from "react";
import { cn } from "@rlz/ui/lib/cn";

export function Pre({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "overflow-x-auto px-4 py-3.5 text-sm bg-transparent focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  );
}
