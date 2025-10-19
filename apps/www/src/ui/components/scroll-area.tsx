import { ComponentProps } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Scroll Area ------------------------------ */

const ScrollAreaRoot = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) => (
  <ScrollAreaPrimitive.Root
    data-slot="scroll-area"
    className={cn("relative", className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Root>
);

/* ------------------------------ Scroll Area Viewport ------------------------------ */

const ScrollAreaViewport = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Viewport>) => (
  <ScrollAreaPrimitive.Viewport
    data-slot="scroll-area-viewport"
    className={cn(
      "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
      className
    )}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Viewport>
);

/* ------------------------------ Scrollbar ------------------------------ */

const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    className={cn(
      "flex touch-none p-px transition-colors select-none",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      data-slot="scroll-area-thumb"
      className="bg-border relative flex-1 rounded-full"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
);

/* ------------------------------ Scroll Area ------------------------------ */

const ScrollArea = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) => {
  return (
    <ScrollAreaRoot className={className} {...props}>
      <ScrollAreaViewport>{children}</ScrollAreaViewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const ScrollAreaComposant = Object.assign(ScrollArea, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  ScrollBar: ScrollBar,
});

export {
  ScrollAreaComposant as ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollBar,
};

