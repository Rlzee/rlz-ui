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
  indent: boolean;
};

const DrawerContext = React.createContext<DrawerContextValue | undefined>({
  layout: "full",
  variant: "default",
  indent: false,
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
  indent = false,
  swipeDirection = "right",
  ...props
}: DrawerPrimitive.Root.Props & {
  layout?: DrawerLayout;
  variant?: DrawerVariant;
  indent?: boolean;
}) {
  return (
    <DrawerContext.Provider value={{ layout, variant, indent }}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerIndent({ className, ...props }: DrawerPrimitive.Indent.Props) {
  return (
    <DrawerPrimitive.Indent
      data-slot="drawer-indent"
      className={cn(
        "[transition:transform_0.4s_cubic-bezier(0.32,0.72,0,1),border-radius_0.25s_cubic-bezier(0.32,0.72,0,1)] origin-[center_top] will-change-transform transform-[scale(1)_translateY(0)] duration-[calc(400ms*var(--indent-transition)),calc(250ms*var(--indent-transition))]",
        "data-active:transform-[scale(calc(0.98+(0.02*var(--indent-progress))))_translateY(calc(0.5rem*(1-var(--indent-progress))))] data-active:rounded-tl-(--indent-radius) data-active:rounded-tr-(--indent-radius)",
        "[--indent-progress:var(--drawer-swipe-progress)] [--indent-radius:calc(1rem*(1-var(--indent-progress)))] [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))]",
        className
      )}
      {...props}
    />
  );
}

function DrawerIndentBackground({
  className,
  ...props
}: DrawerPrimitive.IndentBackground.Props) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="drawer-indent-background"
      className={cn("absolute inset-0", className)}
      {...props}
    />
  );
}

function DrawerProvider(props: DrawerPrimitive.Provider.Props) {
  return <DrawerPrimitive.Provider data-slot="drawer-provider" {...props} />;
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
  const { indent } = useDrawerContext();

  return (
    <Backdrop
      data-slot="drawer-backdrop"
      baseComponent={DrawerPrimitive.Backdrop}
      blur={blur}
      className={cn(indent && "absolute", className)}
      {...props}
    />
  );
}

function DrawerViewport({
  className,
  ...props
}: DrawerPrimitive.Viewport.Props) {
  const { layout, indent } = useDrawerContext();

  return (
    <DrawerPrimitive.Viewport
      data-slot="drawer-viewport"
      data-layout={layout}
      data-indent={indent}
      className={cn(
        "fixed inset-0 z-50 grid data-[indent=true]:absolute",

        // position
        "data-[swipe-direction=down]:grid data-[swipe-direction=down]:grid-rows-[1fr_auto] data-[swipe-direction=down]:pt-12",
        "data-[swipe-direction=up]:grid data-[swipe-direction=up]:grid-rows-[auto_1fr] data-[swipe-direction=up]:pb-12",
        "data-[swipe-direction=left]:flex data-[swipe-direction=left]:justify-start",
        "data-[swipe-direction=right]:flex data-[swipe-direction=right]:justify-end",

        // inset
        "data-[layout=inset]:m-4 data-[layout=inset]:data-[swipe-direction=right]:mx-2",

        //nested
        "data-[layout=inset]:data-nested:m-5",
        className
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
      data-slot="drawer-close-button-x"
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
  portalProps,
  backdrop = true,
  backdropBlur,
  viewportProps,
  showCloseButton = true,
  children,
  className,
  ...props
}: DrawerPrimitive.Popup.Props & {
  portalProps?: React.ComponentProps<typeof DrawerPortal>;
  backdrop?: boolean;
  backdropBlur?: boolean;
  viewportProps?: React.ComponentProps<typeof DrawerViewport>;
  showCloseButton?: boolean;
}) {
  const { layout, variant } = useDrawerContext();

  const { className: viewportClassName, ...restViewportProps } =
    viewportProps ?? {};

  return (
    <DrawerPortal {...portalProps}>
      {backdrop && <DrawerBackdrop blur={backdropBlur} />}
      <DrawerViewport {...restViewportProps} className={viewportClassName}>
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-layout={layout}
          className={cn(
            variant === "bare" ? "bg-popover" : "bg-background",
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col not-dark:bg-clip-padding text-popover-foreground",

            // animation
            "transition-[scale,opacity,translate] duration-200 ease-in-out data-starting-style:opacity-0 data-ending-style:opacity-0",

            //nested
            "data-[layout=inset]:data-nested-drawer-open:data-[swipe-direction=right]:translate-x-[calc(1rem*var(--nested-drawers))] data-[layout=inset]:data-nested-drawer-open:data-[swipe-direction=left]:-translate-x-[calc(1rem*var(--nested-drawers))] data-[swipe-direction=left]:data-[layout=inset]:scale-[calc(1-0.05*var(--nested-drawers))] data-[swipe-direction=right]:data-[layout=inset]:scale-[calc(1-0.05*var(--nested-drawers))]",
            "data-[swipe-direction=right]:data-nested:data-ending-style:translate-x-8 data-[swipe-direction=right]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=right]:data-nested-dialog-open:origin-right",
            "data-[swipe-direction=left]:data-nested:data-ending-style:translate-x-8 data-[swipe-direction=left]:data-nested:data-starting-style:translate-x-8 data-[swipe-direction=left]:data-nested-dialog-open:origin-left",
            "data-[layout=inset]:data-nested-drawer-open:data-[swipe-direction=down]:translate-y-[calc(0.5rem*var(--nested-drawers))] data-[layout=inset]:data-nested-drawer-open:data-[swipe-direction=up]:-translate-y-[calc(0.5rem*var(--nested-drawers))] data-[swipe-direction=down]:data-[layout=inset]:scale-[calc(1-0.01*var(--nested-drawers))] data-[swipe-direction=up]:data-[layout=inset]:scale-[calc(1-0.01*var(--nested-drawers))]",
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
      data-slot="drawer-header"
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
      data-slot="drawer-title"
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
      data-slot="drawer-description"
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
        data-slot="drawer-body"
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
      data-slot="drawer-footer"
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
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerContent(props: DrawerPrimitive.Content.Props) {
  return <DrawerPrimitive.Content data-slot="drawer-content" {...props} />;
}

const DrawerExports = Object.assign(DrawerRoot, {
  Provider: DrawerProvider,
  IndentBackground: DrawerIndentBackground,
  Indent: DrawerIndent,
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
  Content: DrawerContent,
});

export {
  DrawerCreateHandle,
  DrawerExports as Drawer,
  DrawerProvider,
  DrawerIndentBackground,
  DrawerIndent,
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
  DrawerContent,
  useDrawerContext,
};
