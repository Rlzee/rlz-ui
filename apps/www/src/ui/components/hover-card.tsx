import { cn } from "@ui/lib/utils";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { ComponentProps } from "react";

/* ------------------------------ Root Hover Card ------------------------------ */

const HoverCard = (props: ComponentProps<typeof HoverCardPrimitive.Root>) => {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
};

/* ---------------------------- Hover Card Trigger --------------------------- */

const HoverCardTrigger = (
  props: ComponentProps<typeof HoverCardPrimitive.Trigger>
) => {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
};

/* ---------------------------- Hover Card Portal --------------------------- */

const HoverCardPortal = (
  props: ComponentProps<typeof HoverCardPrimitive.Portal>
) => {
  return <HoverCardPrimitive.Portal data-slot="hover-card-portal" {...props} />;
};

/* ---------------------------- Hover Card Content --------------------------- */

const HoverCardContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.Content>) => {
  return (
    <HoverCardPortal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border border-border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </HoverCardPortal>
  );
};

/* ------------------------------ Exports ------------------------------ */

const HoverCardComposant = Object.assign(HoverCard, {
  Trigger: HoverCardTrigger,
  Portal: HoverCardPortal,
  Content: HoverCardContent,
});

export {
  HoverCardComposant as HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
};
