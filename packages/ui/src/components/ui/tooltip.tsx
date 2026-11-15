"use client";

import type * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { PopupArrow } from "@rlz/ui/components/base/popup-arrow";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const tooltipPopupVariants = cva(
  cn(
    "group flex flex-col px-2 py-1 rounded-md text-sm shadow-md",
    "transition-[transform,scale,opacity] data-ending-style:opacity-0 data-ending-style:scale-90 data-instant:transition-none data-starting-style:opacity-0 data-starting-style:scale-90"
  ),
  {
    variants: {
      variant: {
        primary: "bg-foreground text-primary-foreground",
        outline: "bg-popover outline-border outline text-popover-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const TooltipCreateHandle: typeof TooltipPrimitive.createHandle =
  TooltipPrimitive.createHandle;

function TooltipProvider({
  delay = 0,
  closeDelay = 500,
  timeout = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
      {...props}
    />
  );
}

const TooltipRoot: typeof TooltipPrimitive.Root = TooltipPrimitive.Root;

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPortal(props: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
}

function TooltipPositioner(props: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner data-slot="tooltip-positioner" {...props} />
  );
}

type TooltipPopupProps = TooltipPrimitive.Popup.Props &
  VariantProps<typeof tooltipPopupVariants> & {
    positionerProps?: React.ComponentProps<typeof TooltipPositioner>;
  };

function TooltipPopup({
  className,
  variant,
  positionerProps,
  ...props
}: TooltipPopupProps) {
  const {
    sideOffset = 10,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <TooltipPortal>
      <TooltipPositioner
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-popup"
          data-variant={variant}
          className={cn(tooltipPopupVariants({ variant }), className)}
          {...props}
        >
          {props.children}
        </TooltipPrimitive.Popup>
      </TooltipPositioner>
    </TooltipPortal>
  );
}

function TooltipArrow(props: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      render={
        <PopupArrow
          border={1}
          bgClassName="fill-foreground group-data-[variant=outline]:fill-popover"
          borderClassName="fill-none group-data-[variant=outline]:fill-border"
        />
      }
      {...props}
    />
  );
}

type TooltipProps = TooltipPrimitive.Root.Props & {
  arrow?: boolean;
  arrowProps?: React.ComponentProps<typeof TooltipArrow>;
  children?: React.ReactNode;
  popupContent: React.ReactNode;
  popupProps?: React.ComponentProps<typeof TooltipPopup>;
  triggerRender?: TooltipPrimitive.Trigger.Props["render"];
  delay?: TooltipPrimitive.Trigger.Props["delay"];
  closeDelay?: TooltipPrimitive.Trigger.Props["closeDelay"];
};

function Tooltip({
  children: childrenTrigger,
  triggerRender,
  delay = 0,
  closeDelay = 0,
  popupContent,
  popupProps,
  arrow = true,
  arrowProps,
  ...props
}: TooltipProps) {
  return (
    <TooltipRoot {...props}>
      <TooltipTrigger
        delay={delay}
        closeDelay={closeDelay}
        render={triggerRender}
      >
        {childrenTrigger}
      </TooltipTrigger>
      <TooltipPopup {...popupProps}>
        {arrow && <TooltipArrow {...arrowProps} />}
        {popupContent}
      </TooltipPopup>
    </TooltipRoot>
  );
}

const TooltipExport = Object.assign(Tooltip, {
  Root: TooltipRoot,
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
});

export {
  TooltipCreateHandle,
  TooltipExport as Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPopup,
  TooltipArrow,
};
