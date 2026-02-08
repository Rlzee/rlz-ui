import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";

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
        "h-full rounded-[inherit] transition-[color,box-shadow] outline-none",
        "state-focus-ring",
        scrollFade &&
          "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:2rem]",
        scrollbarGutter &&
          "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
        className,
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
        "flex touch-none p-px transition-opacity select-none opacity-0 delay-300",
        "data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent",
        "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent",
        className,
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
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollFade?: React.ComponentProps<typeof ScrollAreaViewport>["scrollFade"];
  scrollbarGutter?: React.ComponentProps<
    typeof ScrollAreaViewport
  >["scrollbarGutter"];
}) {
  return (
    <ScrollAreaRoot className={className} {...props}>
      <ScrollAreaViewport
        scrollFade={scrollFade}
        scrollbarGutter={scrollbarGutter}
      >
        {children}
      </ScrollAreaViewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
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
