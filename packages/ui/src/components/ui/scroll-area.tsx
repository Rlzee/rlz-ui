import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { WithClassNameOmit as WithClassName } from "@/types/ui";
import { cn } from "@/lib/utils";

/* ------------------------------ Root ScrollArea ------------------------------ */

function ScrollAreaRoot({
  className,
  ...props
}: WithClassName<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area-root"
      className={cn("relative", className)}
      {...props}
    />
  );
}

/* ------------------------------ ScrollArea Viewport ------------------------------ */

function ScrollAreaViewport({
  className,
  ...props
}: WithClassName<typeof ScrollAreaPrimitive.Viewport>) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn(
        "size-full rounded-[inherit] transition-[color,box-shadow] outline-none state-focus-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ ScrollArea ScrollBar ------------------------------ */

type ScrollBarProps = WithClassName<typeof ScrollAreaPrimitive.Scrollbar> & {
  orientation?: "vertical" | "horizontal";
};

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
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
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

/* ------------------------------ ScrollArea Corner ------------------------------ */

function ScrollAreaCorner(
  props: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
) {
  return (
    <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" {...props} />
  );
}

/* ------------------------------ ScrollArea Component ------------------------------ */

type ScrollBarVisibility = "vertical" | "horizontal" | "none";

type ScrollAreaComponentProps = WithClassName<
  typeof ScrollAreaPrimitive.Root
> & {
  children: React.ReactNode;
  AreaViewportProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>;
  scrollBar?: ScrollBarVisibility;
  scrollBarProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>;
  AreaCorner?: boolean;
  AreaCornerProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Corner>;
};

function ScrollArea({
  children,
  scrollBar = "vertical",
  scrollBarProps,
  AreaViewportProps,
  AreaCorner = true,
  AreaCornerProps,
  className,
  ...props
}: ScrollAreaComponentProps) {
  return (
    <ScrollAreaRoot className={className} {...props}>
      <ScrollAreaViewport {...AreaViewportProps}>{children}</ScrollAreaViewport>
      {scrollBar !== "none" && (
        <ScrollBar orientation={scrollBar} {...scrollBarProps} />
      )}
      {AreaCorner && <ScrollAreaCorner {...AreaCornerProps} />}
    </ScrollAreaRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const ScrollAreaExports = Object.assign(ScrollArea, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollBar,
  Corner: ScrollAreaCorner,
});

export {
  ScrollAreaExports as ScrollArea,
  ScrollAreaViewport,
  ScrollBar,
  ScrollAreaCorner,
  ScrollAreaRoot,
};
