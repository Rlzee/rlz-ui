import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";

const PopoverCreateHandle = PopoverPrimitive.createHandle;

function PopoverRoot(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverBackdrop({
  className,
  ...props
}: PopoverPrimitive.Backdrop.Props) {
  return (
    <PopoverPrimitive.Backdrop
      data-slot="popover-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}

function PopoverPositioner(props: PopoverPrimitive.Positioner.Props) {
  return (
    <PopoverPrimitive.Positioner data-slot="popover-positioner" {...props} />
  );
}

function PopoverPopup({
  children,
  className,
  backdrop = false,
  backdropProps,
  positionerProps,
  ...props
}: PopoverPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof PopoverBackdrop>;
  positionerProps?: React.ComponentProps<typeof PopoverPositioner>;
}) {
  const {
    sideOffset = 6,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      {backdrop && (
        <PopoverBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <PopoverPositioner
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-popup"
          className={cn(
            "origin-(--transform-origin) rounded-md bg-popover px-6 py-4 shadow-md border",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPositioner>
    </PopoverPrimitive.Portal>
  );
}

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

function PopoverViewport(props: PopoverPrimitive.Viewport.Props) {
  return <PopoverPrimitive.Viewport data-slot="popover-viewport" {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("ui-title", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("ui-description", className)}
      {...props}
    />
  );
}

function PopoverClose(props: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

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
  PopoverCreateHandle,
  PopoverExports as Popover,
  PopoverTrigger,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
