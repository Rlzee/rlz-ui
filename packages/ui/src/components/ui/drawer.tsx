import * as React from "react";
import { DrawerPreview as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Backdrop } from "@/components/base/backdrop";
import { ScrollArea } from "@/components/ui/scroll-area";

type DrawerVariant = "default" | "bare" | "bare-bottom" | "bare-top";
type DrawerLayout = "inset" | "full";

type DrawerContextValue = {
  layout: DrawerLayout;
  variant: DrawerVariant;
};

const DrawerContext = React.createContext<DrawerContextValue | undefined>({
  layout: "full",
  variant: "default",
});

const useDrawerContext = (): DrawerContextValue => {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) {
    throw new Error("useDrawerContext must be used within a Drawer provider");
  }
  return ctx;
};

const DrawerCreateHandle = DrawerPrimitive.createHandle;

function DrawerRoot({
  layout = "full",
  variant = "default",
  swipeDirection = "right",
  ...props
}: DrawerPrimitive.Root.Props & {
  layout?: DrawerLayout;
  variant?: DrawerVariant;
}) {
  return (
    <DrawerContext.Provider value={{ layout: layout, variant: variant }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerBackdrop({
  className,
  blur,
  ...props
}: DrawerPrimitive.Backdrop.Props & {
  blur?: boolean;
}) {
  return (
    <Backdrop
      data-slot="drawer-backdrop"
      baseComponent={DrawerPrimitive.Backdrop}
      blur={blur}
      className={className}
      {...props}
    />
  );
}

function DrawerViewport(props: DrawerPrimitive.Viewport.Props) {
  const { layout } = useDrawerContext();

  return (
    <DrawerPrimitive.Viewport
      data-slot="Drawer-viewport"
      data-layout={layout}
      className={cn(
        "fixed inset-0 z-50 grid",

        // position
        "data-[swipe-direction=down]:grid data-[swipe-direction=down]:grid-rows-[1fr_auto] data-[swipe-direction=down]:pt-12",
        "data-[swipe-direction=up]:grid data-[swipe-direction=up]:grid-rows-[auto_1fr] data-[swipe-direction=up]:pb-12",
        "data-[swipe-direction=left]:flex data-[swipe-direction=left]:justify-start",
        "data-[swipe-direction=right]:flex data-[swipe-direction=right]:justify-end",

        // inset
        "data-[layout=inset]:m-4 data-[layout=inset]:data-[swipe-direction=right]:mx-2",

        //nested
        "data-[layout=inset]:data-nested:m-5"
      )}
      {...props}
    />
  );
}

function DrawerCloseButton({
  className,
  ...props
}: DrawerPrimitive.Close.Props) {
  return (
    <DrawerPrimitive.Close
      data-slot="Drawer-close-button-x"
      className={cn(
        "ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none",
        "data-open:bg-accent data-open:text-muted-foreground",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </DrawerPrimitive.Close>
  );
}

function DrawerPopup({
  backdrop = true,
  backdropProps,
  showCloseButton = true,
  children,
  className,
  ...props
}: DrawerPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof DrawerBackdrop>;
  showCloseButton?: boolean;
}) {
  const { layout, variant } = useDrawerContext();

  return (
    <DrawerPortal>
      {backdrop && (
        <DrawerBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <DrawerViewport>
        <DrawerPrimitive.Popup
          data-slot="Drawer-popup"
          data-layout={layout}
          className={cn(
            variant === "bare" ? "bg-popover" : "bg-background",
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col not-dark:bg-clip-padding text-popover-foreground",

            // animation
            "transition-[scale,opacity,translate] duration-200 ease-in-out data-starting-style:opacity-0 data-ending-style:opacity-0",

            //nested
            "data-[layout=inset]:data-[swipe-direction=right]:translate-x-[calc(1rem*var(--nested-drawers))] data-[layout=inset]:data-[swipe-direction=left]:-translate-x-[calc(1rem*var(--nested-drawers))] data-[swipe-direction=left]:data-[layout=inset]:scale-[calc(1-0.05*var(--nested-drawers))] data-[swipe-direction=right]:data-[layout=inset]:scale-[calc(1-0.05*var(--nested-drawers))]",
            "data-[swipe-direction=right]:data-nested:data-ending-style:translate-x-8 data-[swipe-direction=right]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=right]:data-nested-dialog-open:origin-right",
            "data-[swipe-direction=left]:data-nested:data-ending-style:translate-x-8 data-[swipe-direction=left]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=left]:data-nested-dialog-open:origin-left",
            "data-[layout=inset]:data-[swipe-direction=down]:translate-y-[calc(0.5rem*var(--nested-drawers))] data-[layout=inset]:data-[swipe-direction=up]:-translate-y-[calc(0.5rem*var(--nested-drawers))] data-[swipe-direction=down]:data-[layout=inset]:scale-[calc(1-0.01*var(--nested-drawers))] data-[swipe-direction=up]:data-[layout=inset]:scale-[calc(1-0.01*var(--nested-drawers))]",
            "data-[swipe-direction=down]:data-nested:data-ending-style:translate-y-8 data-[swipe-direction=down]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=down]:data-nested-dialog-open:origin-bottom",
            "data-[swipe-direction=up]:data-nested:data-ending-style:translate-y-8 data-[swipe-direction=up]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=up]:data-nested-dialog-open:origin-top",

            // position
            "data-[swipe-direction=down]:mt-auto data-[swipe-direction=down]:border-t data-[swipe-direction=down]:data-ending-style:translate-y-8 data-[swipe-direction=down]:data-starting-style:translate-y-8",
            "data-[swipe-direction=up]:mb-auto data-[swipe-direction=up]:data-ending-style:-translate-y-8 data-[swipe-direction=up]:data-starting-style:-translate-y-8 data-[swipe-direction=up]:border-b",
            "data-[swipe-direction=left]:data-ending-style:-translate-x-8 data-[swipe-direction=left]:data-starting-style:-translate-x-8 data-[swipe-direction=left]:w-full data-[swipe-direction=left]:max-w-md data-[swipe-direction=left]:border-e",
            "data-[swipe-direction=right]:ml-auto data-[swipe-direction=right]:w-full data-[swipe-direction=right]:max-w-md data-[swipe-direction=right]:border-s data-[swipe-direction=right]:data-ending-style:translate-x-8 data-[swipe-direction=right]:data-starting-style:translate-x-8",

            // inset
            "data-[layout=inset]:rounded-lg data-[layout=inset]:border",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && <DrawerCloseButton />}
        </DrawerPrimitive.Popup>
      </DrawerViewport>
    </DrawerPortal>
  );
}

const DrawerHeader = ({
  className,
  ...props
}: React.ComponentProps<"header">) => {
  const { layout, variant } = useDrawerContext();

  return (
    <header
      data-slot="Drawer-header"
      className={cn(
        "flex flex-col text-left gap-0.5 pt-4 px-6",
        variant === "default" || variant === "bare-bottom"
          ? "border-b border-border/50 pb-4 bg-popover"
          : "",
        layout === "inset" ? "rounded-t-lg" : "",
        className
      )}
      {...props}
    />
  );
};

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="Drawer-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="Drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerBody({
  scrollClassName,
  scrollFade = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  scrollFade?: React.ComponentProps<typeof ScrollArea>["scrollFade"];
  scrollClassName?: React.ComponentProps<typeof ScrollArea>["className"];
}) {
  return (
    <ScrollArea scrollFade={scrollFade} className={scrollClassName}>
      <div
        data-slot="Drawer-body"
        className={cn("flex flex-col gap-6 px-6 py-6 h-full", className)}
        {...props}
      />
    </ScrollArea>
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"footer">) {
  const { layout, variant } = useDrawerContext();

  return (
    <footer
      data-slot="Drawer-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-4",
        variant === "default" || variant === "bare-top"
          ? "pt-4 border-t border-border/50 bg-popover"
          : "",
        layout === "inset" ? "rounded-b-lg" : "",
        className
      )}
      {...props}
    />
  );
}

function DrawerClose(props: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="Drawer-close" {...props} />;
}

const DrawerExports = Object.assign(DrawerRoot, {
  Portal: DrawerPortal,
  Trigger: DrawerTrigger,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
  Popup: DrawerPopup,
  Viewport: DrawerViewport,
  Backdrop: DrawerBackdrop,
});

export {
  DrawerCreateHandle,
  DrawerExports as Drawer,
  DrawerPortal,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerViewport,
  DrawerBackdrop,
  DrawerPopup,
  DrawerTrigger,
  useDrawerContext,
};
