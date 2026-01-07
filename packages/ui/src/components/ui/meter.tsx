import * as React from "react";
import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import type { WithClassNameOmit as WithClassName } from "@/types/ui";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Meter ------------------------------ */

function MeterRoot({
  className,
  ...props
}: WithClassName<typeof MeterPrimitive.Root>) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("box-border grid w-full grid-cols-2 gap-y-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Meter Label ------------------------------ */

function MeterLabel({
  className,
  ...props
}: WithClassName<typeof MeterPrimitive.Label>) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

/* ------------------------------ Meter Value ------------------------------ */

function MeterValue({
  className,
  ...props
}: WithClassName<typeof MeterPrimitive.Value>) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn(
        "col-start-2 m-0 text-right text-sm leading-5 text-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Meter Track ------------------------------ */

function MeterTrack({
  className,
  ...props
}: WithClassName<typeof MeterPrimitive.Track>) {
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

/* ------------------------------ Meter Indicator ------------------------------ */

function MeterIndicator({
  className,
  ...props
}: WithClassName<typeof MeterPrimitive.Indicator>) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("block bg-primary transition-all duration-500", className)}
      {...props}
    />
  );
}

/* ------------------------------ Meter Component ------------------------------ */

type MeterProps = React.ComponentProps<typeof MeterPrimitive.Root> & {
  label?: string;
};

function Meter({ label, ...props }: MeterProps) {
  return (
    <MeterRoot {...props}>
      <MeterLabel>{label}</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </MeterRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const MeterComposed = Object.assign(Meter, {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
});

export {
  MeterComposed as Meter,
  MeterRoot,
  MeterLabel,
  MeterValue,
  MeterTrack,
  MeterIndicator,
};
