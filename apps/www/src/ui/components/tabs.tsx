import { ComponentProps } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Tabs Root ------------------------------ */

const Tabs = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
};

/* ------------------------------ Tabs List ------------------------------ */

const TabsList = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-secondary text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Tabs Trigger ------------------------------ */

const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:border-border text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Tabs Content ------------------------------ */

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const tabsComposed = Object.assign(Tabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { tabsComposed as Tabs, TabsList, TabsTrigger, TabsContent };
