import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@/lib/utils";

function MeterRoot({ className, ...props }: MeterPrimitive.Root.Props) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("box-border grid w-full grid-cols-2 gap-y-2", className)}
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
      className={cn(
        "col-start-2 m-0 text-right text-sm leading-5 text-foreground",
        className,
      )}
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
        className,
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

function Meter({
  label,
  ...props
}: MeterPrimitive.Root.Props & {
  label?: string;
}) {
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
