"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Separator } from "@rlz/ui/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { cn } from "@rlz/ui/lib/cn";

export function CodeTriggerWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Collapsible
      className={className}
      onOpenChange={setIsOpened}
      open={isOpened}
      {...props}
    >
      <Collapsible.Trigger
        className={cn(
          "cursor-pointer w-full bg-background py-3.5 text-sm text-muted-foreground border text-left px-3 flex items-center rounded-b-md transition-[border-radius] duration-500",
          "data-panel-open:duration-0 data-panel-open:[&_svg]:rotate-90 data-panel-open:rounded-b-none"
        )}
      >
        <ChevronRight className="mr-1 h-4 w-4" />
        {isOpened ? "Hide Code" : "Show Code"}
      </Collapsible.Trigger>
      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible>
  );
}
