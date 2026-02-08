import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function TabsRoot({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("relative z-0 flex gap-1", className)}
      {...props}
    />
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "flex h-9 items-center justify-center border-0 px-2 text-sm font-medium break-keep whitespace-nowrap text-muted-foreground outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 hover:text-foreground focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2 data-active:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

const TabsIndicatorVariants = cva(
  "absolute left-0 z-[-1] w-(--active-tab-width) translate-x-(--active-tab-left) transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "top-1/2 -translate-y-1/2 h-9 rounded-md bg-accent",
        underline: "bottom-0 h-0.5 bg-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsIndicator({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.Indicator.Props & VariantProps<typeof TabsIndicatorVariants>) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      data-variant={variant}
      className={cn(TabsIndicatorVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

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
