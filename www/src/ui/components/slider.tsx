"use client";

import { ComponentProps, useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Slider ------------------------------ */

const SliderRoot = ({
  children,
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) => {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {children}
    </SliderPrimitive.Root>
  );
};

/* ------------------------------ Slider Track ------------------------------ */

const SliderTrack = ({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Track>) => {
  return (
    <SliderPrimitive.Track
      className={cn(
        "bg-secondary relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Slider Range ------------------------------ */

const SliderRange = ({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Range>) => {
  return (
    <SliderPrimitive.Range
      className={cn(
        "from-primary/85 to-primary inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-zinc-50/50 shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-zinc-950/50 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Slider Thumb ------------------------------ */

const SliderThumb = ({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Thumb>) => {
  return (
    <SliderPrimitive.Thumb
      className={cn(
        "bg-foreground block size-4 shrink-0 rounded-full transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Slider ------------------------------ */

const Slider = ({
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: ComponentProps<typeof SliderRoot>) => {
  const _values = useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderRoot
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>

      {_values.map((_, i) => (
        <SliderThumb key={i} />
      ))}
    </SliderRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const SliderComposed = Object.assign(Slider, {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
});

export {
  SliderComposed as Slider,
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
};
