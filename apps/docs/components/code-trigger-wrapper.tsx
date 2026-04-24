"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Separator } from "@rlz/ui/components/ui/separator";
import { cn } from "@rlz/ui/lib/cn";

export function CodeTriggerWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Collapsible
      className={cn("group/collapsible relative", className)}
      onOpenChange={setIsOpened}
      open={isOpened}
      {...props}
    >
      <Collapsible.Panel
        className="[&>figure]:md:!mx-0 relative h-full overflow-hidden data-closed:max-h-32 [&>figure]:mt-0"
        hidden={false}
        keepMounted
      >
        {children}
      </Collapsible.Panel>
      <div className="z-10 bg-gradient-to-b from-secondary/50 to-secondary/60 dark:from-secondary/40 dark:to-secondary/90 absolute inset-x-0 -bottom-2 flex h-32 items-center justify-center rounded-b-md group-data-open/collapsible:hidden border border-t-0">
        <Collapsible.Trigger
          render={
            <Button variant="outline">
              {isOpened ? "Hide Code" : "View Code"}
            </Button>
          }
        />
      </div>
    </Collapsible>
  );
}
