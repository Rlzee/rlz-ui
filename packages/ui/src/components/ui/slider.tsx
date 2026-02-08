import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

function SliderRoot(props: SliderPrimitive.Root.Props) {
  return <SliderPrimitive.Root data-slot="slider" {...props} />;
}

function SliderValue(props: SliderPrimitive.Value.Props) {
  return <SliderPrimitive.Value data-slot="slider-value" {...props} />;
}

function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        "flex w-full touch-none items-center py-3 select-none",
        className,
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
        className,
      )}
      {...props}
    />
  );
}

function Slider({
  showValue = false,
  value,
  defaultValue,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props & {
  showValue?: boolean;
}) {
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
      {showValue && values.map((_, index) => <SliderValue key={index} />)}
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
