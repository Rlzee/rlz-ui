import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const TooltipCreateHandle = TooltipPrimitive.createHandle;

function TooltipProvider(props: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

function TooltipRoot(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip-root" {...props} />;
}

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipPositioner(props: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner data-slot="tooltip-positioner" {...props} />
  );
}

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
    <TooltipPrimitive.Portal data-slot="tooltip-portal">
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
    </TooltipPrimitive.Portal>
  );
}

function TooltipArrow(props: ArrowType) {
  return (
    <PopupArrow
      data-slot="tooltip-arrow"
      border={1}
      classNameBg={cn(
        "fill-foreground group-data-[variant=outline]:fill-popover",
        props.classNameBg
      )}
      classNameBorder={cn(
        "fill-none group-data-[variant=outline]:fill-border",
        props.classNameBorder
      )}
      baseComponent={TooltipPrimitive.Arrow}
      {...props}
    />
  );
}

type TooltipProps = TooltipPrimitive.Root.Props & {
  arrow?: boolean;
  arrowProps?: React.ComponentProps<typeof TooltipArrow>;
  children: React.ReactNode;
  popupContent: React.ReactNode;
  popupProps?: React.ComponentProps<typeof TooltipPopup>;
  triggerRender?: TooltipPrimitive.Trigger.Props["render"];
};

function Tooltip({
  children: childrenTrigger,
  triggerRender,
  popupContent,
  popupProps,
  arrow = true,
  arrowProps,
  ...props
}: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipRoot {...props}>
        <TooltipTrigger render={triggerRender}>
          {childrenTrigger}
        </TooltipTrigger>
        <TooltipPopup {...popupProps}>
          {arrow && <TooltipArrow {...arrowProps} />}
          {popupContent}
        </TooltipPopup>
      </TooltipRoot>
    </TooltipProvider>
  );
}

const TooltipExport = Object.assign(Tooltip, {
  Root: TooltipRoot,
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
});

export {
  TooltipCreateHandle,
  TooltipExport as Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPopup,
  TooltipArrow,
};
