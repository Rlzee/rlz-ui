import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Slider ------------------------------ */

function SliderRoot(props: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return <SliderPrimitive.Root data-slot="slider" {...props} />;
}

/* ------------------------------ Slider Value ------------------------------ */

function SliderValue(
  props: React.ComponentProps<typeof SliderPrimitive.Value>
) {
  return <SliderPrimitive.Value data-slot="slider-value" {...props} />;
}

/* ------------------------------ Slider Control ------------------------------ */

function SliderControl({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Control>) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        "flex w-full touch-none items-center py-3 select-none",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Slider Track ------------------------------ */

function SliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Track>) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn("h-1 w-full rounded bg-accent select-none", className)}
      {...props}
    />
  );
}

/* ------------------------------ Slider Indicator ------------------------------ */

function SliderIndicator({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Indicator>) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("bg-primary rounded select-none", className)}
      {...props}
    />
  );
}

/* ------------------------------ Slider Thumb ------------------------------ */

function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "size-4 rounded-full bg-primary outline-1 outline-ring select-none",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Slider Component ------------------------------ */

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  showValue?: boolean;
};

function Slider({ showValue = false, ...props }: SliderProps) {
  return (
    <SliderRoot {...props}>
      {showValue && <SliderValue />}
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const SliderExport = Object.assign(Slider, {
  Root: SliderRoot,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
});

export {
  SliderExport as Slider,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
};
