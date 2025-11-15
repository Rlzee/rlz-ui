import { ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Drawer ------------------------------ */

const Drawer = (props: ComponentProps<typeof DrawerPrimitive.Root>) => {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
};

/* ------------------------------ Drawer Triiger ------------------------------ */

const DrawerTrigger = (
  props: ComponentProps<typeof DrawerPrimitive.Trigger>
) => {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
};

/* ------------------------------ Drawer Portal ------------------------------ */

const DrawerPortal = (props: ComponentProps<typeof DrawerPrimitive.Portal>) => {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
};

/* ------------------------------ Drawer Overlay ------------------------------ */

const DrawerOverlay = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Overlay>) => {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 bg-black/50 z-50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Content ------------------------------ */

interface DrawerContentProps
  extends ComponentProps<typeof DrawerPrimitive.Content> {
  overlay?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const DrawerContent = ({
  children,
  overlay = true,
  className,
  ...props
}: DrawerContentProps) => {
  return (
    <DrawerPortal>
      {overlay && <DrawerOverlay />}
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "bg-popover z-50 flex h-auto flex-col outline-none fixed group/drawer-content border-border",
          "data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:left-0 data-[vaul-drawer-direction=bottom]:right-0 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:left-0 data-[vaul-drawer-direction=top]:right-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:top-0 data-[vaul-drawer-direction=left]:bottom-0 data-[vaul-drawer-direction=left]:w-64 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:rounded-r-lg",
          "data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:top-0 data-[vaul-drawer-direction=right]:bottom-0 data-[vaul-drawer-direction=right]:w-64 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:rounded-l-lg",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
};

/* ------------------------------ Drawer Handle ------------------------------ */

const DrawerHandle = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Handle>) => {
  return (
    <DrawerPrimitive.Handle
      data-slot="drawer-handle"
      style={{ backgroundColor: "var(--foreground)" }}
      className={cn(
        "min-w-12",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:mt-2 group-data-[vaul-drawer-direction=bottom]/drawer-content:order-first",
        "group-data-[vaul-drawer-direction=top]/drawer-content:mb-2 group-data-[vaul-drawer-direction=top]/drawer-content:order-last",
        "group-data-[vaul-drawer-direction=left]/drawer-content:invisible",
        "group-data-[vaul-drawer-direction=right]/drawer-content:invisible",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Header ------------------------------ */

const DrawerHeader = ({ className, ...props }: ComponentProps<"header">) => {
  return (
    <header
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 md:gap-1.5 md:text-left",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Title ------------------------------ */

const DrawerTitle = (props: ComponentProps<typeof DrawerPrimitive.Title>) => {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-lg font-semibold", props.className)}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Description ------------------------------ */

const DrawerDescription = (
  props: ComponentProps<typeof DrawerPrimitive.Description>
) => {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", props.className)}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Body ------------------------------ */

const DrawerBody = ({ className, ...props }: ComponentProps<"main">) => {
  return (
    <main
      data-slot="drawer-body"
      className={cn(
        "flex-1 overflow-y-auto px-4",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Footer ------------------------------ */

const DrawerFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      data-slot="drawer-footer"
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
};

/* ------------------------------ Drawer Close ------------------------------ */

const DrawerClose = (props: ComponentProps<typeof DrawerPrimitive.Close>) => {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
};

/* ------------------------------ Exports ------------------------------ */

const DrawerComposed = Object.assign(Drawer, {
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Handle: DrawerHandle,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
});

export {
  DrawerComposed as Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
};
