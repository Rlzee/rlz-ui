import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Tabs ------------------------------ */

function TabsRoot({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Tabs List ------------------------------ */

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("relative z-0 flex gap-1", className)}
      {...props}
    />
  );
}

/* ------------------------------ Tabs Tab  ------------------------------ */

function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "flex h-9 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-muted-foreground outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 hover:text-foreground focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Tabs Indicator  ------------------------------ */

function TabsIndicator({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Indicator>) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute top-1/2 left-0 z-[-1] h-9 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-md bg-accent transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Tabs Panel  ------------------------------ */

function TabsPanel({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

/* ------------------------------ Exports  ------------------------------ */

const TabsExports = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
});

export {
  TabsExports as Tabs,
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
};
