import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Backdrop } from "@/components/ui/base/backdrop";
import { ScrollArea } from "@/components/ui/scroll-area";

type SheetVariant = "default" | "bare" | "bare-bottom" | "bare-top";
type SheetLayout = "inset" | "full";

type SheetContextValue = {
  layout: SheetLayout;
  variant: SheetVariant;
};

const SheetContext = React.createContext<SheetContextValue | undefined>({
  layout: "full",
  variant: "default",
});

const useSheetContext = (): SheetContextValue => {
  const ctx = React.useContext(SheetContext);
  if (!ctx) {
    throw new Error("useSheetContext must be used within a Sheet provider");
  }
  return ctx;
};

function SheetRoot({
  layout = "full",
  variant = "default",
  ...props
}: SheetPrimitive.Root.Props & {
  layout?: SheetLayout;
  variant?: SheetVariant;
}) {
  return (
    <SheetContext.Provider value={{ layout: layout, variant: variant }}>
      <SheetPrimitive.Root data-slot="sheet" {...props} />
    </SheetContext.Provider>
  );
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetBackdrop({
  className,
  blur,
  ...props
}: SheetPrimitive.Backdrop.Props & {
  blur?: boolean;
}) {
  return (
    <Backdrop
      data-slot="sheet-backdrop"
      baseComponent={SheetPrimitive.Backdrop}
      blur={blur}
      className={className}
      {...props}
    />
  );
}

function SheetViewport({
  side,
  ...props
}: SheetPrimitive.Viewport.Props & {
  side?: "right" | "left" | "top" | "bottom";
}) {
  const { layout } = useSheetContext();

  return (
    <SheetPrimitive.Viewport
      data-slot="sheet-viewport"
      data-layout={layout}
      data-side={side}
      className={cn(
        "fixed inset-0 z-50 grid",

        // position
        "data-[side=bottom]:grid data-[side=bottom]:grid-rows-[1fr_auto] data-[side=bottom]:pt-12",
        "data-[side=top]:grid data-[side=top]:grid-rows-[auto_1fr] data-[side=top]:pb-12",
        "data-[side=left]:flex data-[side=left]:justify-start",
        "data-[side=right]:flex data-[side=right]:justify-end",

        // inset
        "data-[layout=inset]:m-4 data-[layout=inset]:data-[side=right]:mx-2",
      )}
      {...props}
    />
  );
}

function SheetCloseButton({ className, ...props }: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close-button-x"
      className={cn(
        "ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none",
        "data-open:bg-accent data-open:text-muted-foreground",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </SheetPrimitive.Close>
  );
}

function SheetPopup({
  backdrop = true,
  backdropProps,
  showCloseButton = true,
  side = "right",
  children,
  className,
  ...props
}: SheetPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof SheetBackdrop>;
  showCloseButton?: boolean;
  side?: "right" | "left" | "top" | "bottom";
}) {
  const { layout, variant } = useSheetContext();

  return (
    <SheetPortal>
      {backdrop && (
        <SheetBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <SheetViewport side={side}>
        <SheetPrimitive.Popup
          data-slot="sheet-popup"
          data-side={side}
          data-layout={layout}
          className={cn(
            variant === "bare" ? "bg-popover" : "bg-background",
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col not-dark:bg-clip-padding text-popover-foreground",

            // animation
            "transition-[opacity,translate] duration-200 ease-in-out data-starting-style:opacity-0 data-ending-style:opacity-0",

            // position
            "data-[side=bottom]:row-start-2 data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-8 data-[side=bottom]:data-starting-style:translate-y-8",
            "data-[side=top]:data-ending-style:-translate-y-8 data-[side=top]:data-starting-style:-translate-y-8 data-[side=top]:border-b",
            "data-[side=left]:data-ending-style:-translate-x-8 data-[side=left]:data-starting-style:-translate-x-8 data-[side=left]:w-full data-[side=left]:max-w-md data-[side=left]:border-e",
            "data-[side=right]:col-start-2 data-[side=right]:w-full data-[side=right]:max-w-md data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-8 data-[side=right]:data-starting-style:translate-x-8",

            // inset
            "data-[layout=inset]:rounded-lg data-[layout=inset]:border",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && <SheetCloseButton />}
        </SheetPrimitive.Popup>
      </SheetViewport>
    </SheetPortal>
  );
}

const SheetHeader = ({
  className,
  ...props
}: React.ComponentProps<"header">) => {
  const { layout, variant } = useSheetContext();

  return (
    <header
      data-slot="sheet-header"
      className={cn(
        "flex flex-col text-left gap-0.5 pt-4 px-6",
        variant === "default" || variant === "bare-bottom"
          ? "border-b border-border/50 pb-4 bg-popover"
          : "",
        layout === "inset" ? "rounded-t-lg" : "",
        className,
      )}
      {...props}
    />
  );
};

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function SheetBody({
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
        data-slot="sheet-body"
        className={cn("flex flex-col gap-6 px-6 py-6 h-full", className)}
        {...props}
      />
    </ScrollArea>
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"footer">) {
  const { layout, variant } = useSheetContext();

  return (
    <footer
      data-slot="sheet-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-4",
        variant === "default" || variant === "bare-top"
          ? "pt-4 border-t border-border/50 bg-popover"
          : "",
        layout === "inset" ? "rounded-b-lg" : "",
        className,
      )}
      {...props}
    />
  );
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/* eslint-disable react-refresh/only-export-components */
const SheetExports = Object.assign(SheetRoot, {
  Portal: SheetPortal,
  Trigger: SheetTrigger,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: SheetClose,
  Popup: SheetPopup,
  Viewport: SheetViewport,
  Backdrop: SheetBackdrop,
});

export {
  SheetExports as Sheet,
  SheetPortal,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
  SheetViewport,
  SheetBackdrop,
  SheetPopup,
  SheetTrigger,
  useSheetContext,
};
