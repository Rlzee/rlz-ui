"use client";

import * as React from "react";
import { Button } from "@rlz/ui/components/ui/button";
import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Separator } from "@rlz/ui/components/ui/separator";
import { cn } from "@rlz/ui/lib/cn";

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Collapsible
      className={cn("group/collapsible relative md:-mx-1", className)}
      onOpenChange={setIsOpened}
      open={isOpened}
      {...props}
    >
      <div className="absolute top-8 right-10 z-10 flex items-center">
        <Collapsible.Trigger
          render={
            <Button className="text-muted-foreground" variant="ghost" size="sm">
              {isOpened ? "Collapse" : "Expand"}
            </Button>
          }
        />
        <Separator className="mx-2 h-4" orientation="vertical" />
      </div>
      <Collapsible.Panel
        className="[&>figure]:md:!mx-0 relative h-full overflow-hidden data-closed:max-h-64 [&>figure]:mt-0"
        hidden={false}
        keepMounted
      >
        {children}
      </Collapsible.Panel>
      <Collapsible.Trigger className="bg-gradient-to-b from-secondary/70 to-secondary/90 dark:from-secondary/90 dark:to-secondary/90 absolute inset-x-0 -bottom-2 flex h-20 cursor-pointer items-center justify-center rounded-b-md font-medium text-muted-foreground text-sm transition-colors hover:text-foreground group-data-open/collapsible:hidden border border-t-0">
        {isOpened ? "Collapse" : "Expand"}
      </Collapsible.Trigger>
    </Collapsible>
  );
}
