import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Popover ------------------------------ */

function PopoverRoot(
  props: React.ComponentProps<typeof PopoverPrimitive.Root>
) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/* ------------------------------ Popover Trigger ------------------------------ */

function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/* ------------------------------ Popover Popup ------------------------------ */

type PopoverPopupProps = React.ComponentProps<typeof PopoverPrimitive.Popup> & {
  children: React.ReactNode;
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof PopoverPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<typeof PopoverPrimitive.Positioner>;
};

function PopoverPopup({
  children,
  className,
  backdrop = false,
  backdropProps,
  positionerProps = {
    sideOffset: 8,
  },
  ...props
}: PopoverPopupProps) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      {backdrop && (
        <PopoverPrimitive.Backdrop
          data-slot="popover-backdrop"
          {...backdropProps}
        />
      )}
      <PopoverPrimitive.Positioner
        data-slot="popover-positioner"
        {...positionerProps}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-popup"
          className={cn(
            "origin-(--transform-origin) rounded-md bg-popover px-6 py-4 shadow-md border",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "data-side-bottom:slide-in-from-top-2 data-side-left:slide-in-from-right-2 data-side-right:slide-in-from-left-2 data-side-top:slide-in-from-bottom-2",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

/* ------------------------------ Popover Arrow ------------------------------ */

function PopoverArrow(props: ArrowType) {
  return (
    <PopupArrow
      border={2}
      baseComponent={PopoverPrimitive.Arrow}
      data-slot="popover-arrow"
      {...props}
    />
  );
}

/* ------------------------------ Popover Viewport ------------------------------ */

function PopoverViewport(
  props: React.ComponentProps<typeof PopoverPrimitive.Viewport>
) {
  return <PopoverPrimitive.Viewport data-slot="popover-viewport" {...props} />;
}

/* ------------------------------ Popover Title ------------------------------ */

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Title>) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

/* ------------------------------ Popover Description ------------------------------ */

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Description>) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ------------------------------ Popover Close ------------------------------ */

function PopoverClose(
  props: React.ComponentProps<typeof PopoverPrimitive.Close>
) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

/* ------------------------------ Exports ------------------------------ */

const PopoverExports = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Viewport: PopoverViewport,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});

export {
  PopoverExports as Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
