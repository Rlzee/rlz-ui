"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@rlz/ui/lib/cn";

function SliderRoot({ className, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("data-[orientation=horizontal]:w-full", className)}
      {...props}
    />
  );
}

function SliderValue(props: SliderPrimitive.Value.Props) {
  return <SliderPrimitive.Value data-slot="slider-value" {...props} />;
}

function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        "flex w-full touch-none items-center py-1.5 select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn("h-1 w-full rounded bg-accent select-none", className)}
      {...props}
    />
  );
}

function SliderIndicator({
  className,
  ...props
}: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("bg-primary rounded select-none", className)}
      {...props}
    />
  );
}

function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
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

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  children,
  ...props
}: SliderPrimitive.Root.Props) {
  const values = React.useMemo(() => {
    if (value !== undefined) return Array.isArray(value) ? value : [value];
    if (defaultValue !== undefined)
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    return [min];
  }, [value, defaultValue, min]);

  return (
    <SliderRoot
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      {...props}
    >
      {children}
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          {values.map((_, index) => (
            <SliderThumb key={index} index={index} />
          ))}
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
}

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
