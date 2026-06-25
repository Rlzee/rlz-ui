"use client";

import type React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@rlz/ui/lib/cn";

function ScrollAreaRoot({
  className,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area-root"
      className={cn("size-full min-h-0", className)}
      {...props}
    />
  );
}

function ScrollAreaViewport({
  scrollFade = true,
  scrollbarGutter = true,
  className,
  ...props
}: ScrollAreaPrimitive.Viewport.Props & {
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
}) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn(
        "h-full rounded-[inherit] transition-shadows outline-none data-has-overflow-y:overscroll-y-contain data-has-overflow-x:overscroll-x-contain",
        "state-focus-ring",
        scrollFade &&
          "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]",
        scrollbarGutter &&
          "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
        className
      )}
      {...props}
    />
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & {
  orientation?: "vertical" | "horizontal";
}) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "m-1 flex opacity-0 transition-opacity delay-0",
        "data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-0",
        "data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col",
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

function ScrollAreaCorner(props: ScrollAreaPrimitive.Corner.Props) {
  return (
    <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" {...props} />
  );
}

function ScrollArea({
  children,
  className,
  scrollFade = false,
  scrollbarGutter = false,
  orientation = "both",
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollFade?: React.ComponentProps<typeof ScrollAreaViewport>["scrollFade"];
  scrollbarGutter?: React.ComponentProps<
    typeof ScrollAreaViewport
  >["scrollbarGutter"];
  orientation?: React.ComponentProps<typeof ScrollBar>["orientation"] | "both";
}) {
  return (
    <ScrollAreaRoot className={className} {...props}>
      <ScrollAreaViewport
        scrollFade={scrollFade}
        scrollbarGutter={scrollbarGutter}
      >
        {children}
      </ScrollAreaViewport>
      {(orientation === "both" || orientation === "vertical") && (
        <ScrollBar orientation="vertical" />
      )}
      {(orientation === "both" || orientation === "horizontal") && (
        <ScrollBar orientation="horizontal" />
      )}
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  );
}

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
