"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@rlz/ui/lib/cn";

function MeterRoot({ className, ...props }: MeterPrimitive.Root.Props) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn("text-right text-sm leading-5 text-foreground", className)}
      {...props}
    />
  );
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn(
        "col-span-2 block h-2 w-full overflow-hidden bg-accent",
        className
      )}
      {...props}
    />
  );
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("block bg-primary transition-all duration-500", className)}
      {...props}
    />
  );
}

function Meter({ children, ...props }: MeterPrimitive.Root.Props) {
  return (
    <MeterRoot {...props}>
      {children}
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </MeterRoot>
  );
}

const MeterExports = Object.assign(Meter, {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
});

export {
  MeterExports as Meter,
  MeterRoot,
  MeterLabel,
  MeterValue,
  MeterTrack,
  MeterIndicator,
};
