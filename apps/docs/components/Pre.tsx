import type * as React from "react";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { cn } from "@rlz/ui/lib/cn";

export function Pre({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2 **:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2">
      <pre
        className={cn(
          "px-4 py-3.5 text-sm bg-transparent focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </ScrollArea>
  );
}
