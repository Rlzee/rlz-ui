import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";

/* ------------------------------ Tooltip Provider ------------------------------ */

function TooltipProvider(
  props: React.ComponentProps<typeof TooltipPrimitive.Provider>
) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

/* ------------------------------ Tooltip Root ------------------------------ */

function TooltipRoot(
  props: React.ComponentProps<typeof TooltipPrimitive.Root>
) {
  return <TooltipPrimitive.Root data-slot="tooltip-root" {...props} />;
}

/* ------------------------------ Tooltip Trigger ------------------------------ */

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/* ------------------------------ Tooltip Popup ------------------------------ */

type TooltipPopupVariants = "primary" | "outline";

const TooltipPopupVariants: Record<TooltipPopupVariants, string> = {
  primary: "bg-foreground text-primary-foreground",
  outline: "bg-popover outline-border outline text-foreground",
};

type TooltipPopupProps = React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  variant?: TooltipPopupVariants;
  positionerProps?: React.ComponentProps<typeof TooltipPrimitive.Positioner>;
};

function TooltipPopup({
  className,
  variant = "primary",
  positionerProps = {
    sideOffset: 10,
  },
  ...props
}: TooltipPopupProps) {
  return (
    <TooltipPrimitive.Portal data-slot="tooltip-portal">
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        {...positionerProps}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-popup"
          data-variant={variant}
          className={cn(
            "group flex flex-col px-2 py-1 rounded-md text-sm shadow-md",
            TooltipPopupVariants[variant],
            "transition-[transform,scale,opacity] data-ending-style:opacity-0 data-ending-style:scale-90 data-instant:transition-none data-starting-style:opacity-0 data-starting-style:scale-90",
            className
          )}
          {...props}
        >
          {props.children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

/* ------------------------------ Tooltip Arrow ------------------------------ */

function TooltipArrow(props: ArrowType) {
  return (
    <PopupArrow
      data-slot="tooltip-arrow"
      border={1}
      classNameBg={cn(
        "group-data-[variant=primary]:fill-foreground group-data-[variant=outline]:fill-popover",
        props.classNameBg
      )}
      classNameBorder={cn(
        "group-data-[variant=primary]:fill-none group-data-[variant=outline]:fill-border",
        props.classNameBorder
      )}
      baseComponent={TooltipPrimitive.Arrow}
      {...props}
    />
  );
}

/* ------------------------------ Tooltip Component ------------------------------ */

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root> & {
  children: React.ReactNode;
  triggerRender?: React.ComponentProps<
    typeof TooltipPrimitive.Trigger
  >["render"];
  popupContent: React.ReactNode;
  popupProps?: React.ComponentProps<typeof TooltipPopup>;
  arrow?: boolean;
  arrowProps?: React.ComponentProps<typeof TooltipArrow>;
};

function Tooltip({
  children: childrenTrigger,
  triggerRender,
  popupContent,
  popupProps = {
    variant: "primary",
  },
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
/* ------------------------------ Exports ------------------------------ */

const TooltipExport = Object.assign(Tooltip, {
  Root: TooltipRoot,
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
});

export {
  TooltipExport as Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPopup,
  TooltipArrow,
  TooltipPopupVariants,
};
