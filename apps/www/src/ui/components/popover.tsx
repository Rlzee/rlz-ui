import { ComponentProps } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Popover ------------------------------ */

const Popover = (props: ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
};

/* ------------------------------ Trigger Popover ------------------------------ */

const PopoverTrigger = (
  props: ComponentProps<typeof PopoverPrimitive.Trigger>
) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
};

/* ------------------------------ Portal Popover ------------------------------ */

const PopoverPortal = (
  props: ComponentProps<typeof PopoverPrimitive.Portal>
) => {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />;
};

/* ------------------------------ Content Popover ------------------------------ */

interface PopoverContentProps
  extends ComponentProps<typeof PopoverPrimitive.Content> {
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const PopoverContent = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverContentProps) => (
  <PopoverPortal>
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md bg-popover p-4 text-popover-foreground outline-hidden border border-border",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPortal>
);

/* ------------------------------ Anchor Popover ------------------------------ */

const PopoverAnchor = (
  props: ComponentProps<typeof PopoverPrimitive.Anchor>
) => {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
};

/* ------------------------------ Exports ------------------------------ */

const PopoverComposant = Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Anchor: PopoverAnchor,
});

export {
  PopoverComposant as Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverAnchor,
};
