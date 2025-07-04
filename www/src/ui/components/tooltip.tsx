"use client";

import { cn } from "@/src/lib/utils";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import {
  ComponentProps,
  ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from "react";

/* ----------------------------- Root Tooltip ----------------------------- */

const TooltipRoot = (props: ComponentProps<typeof HoverCardPrimitive.Root>) => {
  return (
    <HoverCardPrimitive.Root openDelay={500} closeDelay={100} {...props} />
  );
};

/* --------------------------- Tooltip Trigger --------------------------- */

const TooltipTrigger = ({
  children,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Trigger>) => {
  return (
    <HoverCardPrimitive.Trigger asChild {...props}>
      {children}
    </HoverCardPrimitive.Trigger>
  );
};

/* --------------------------- Tooltip Content --------------------------- */

interface TooltipContentProps
  extends ComponentProps<typeof HoverCardPrimitive.Content> {
  id?: string;
}

const TooltipContent = ({
  className,
  sideOffset = 6,
  id,
  ...props
}: TooltipContentProps) => {
  const fallbackId = useId();
  const tooltipId = id || fallbackId;

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        id={tooltipId}
        role="tooltip"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-sm rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
};

/* ----------------------------- Tooltip ----------------------------- */

interface SimpleTooltipProps {
  content: ReactNode;
  children: React.ReactElement;
  className?: string;
  side?: ComponentProps<typeof TooltipContent>["side"];
}

const Tooltip = ({
  content,
  children,
  className,
  side,
}: SimpleTooltipProps) => {
  const id = useId();

  const trigger = isValidElement(children)
    ? cloneElement(
        children as React.ReactElement<{ "aria-describedby"?: string }>,
        {
          "aria-describedby": id,
        }
      )
    : children;

  return (
    <TooltipRoot>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent id={id} className={className} side={side}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

export { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger };
