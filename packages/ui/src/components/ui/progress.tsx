import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { WithClassNameOmit as WithClassName } from "@/types/ui";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Progress ------------------------------ */

function ProgressRoot({
  className,
  ...props
}: WithClassName<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("grid w-full grid-cols-2 gap-y-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Progress Label ------------------------------ */

function ProgressLabel({
  className,
  ...props
}: WithClassName<typeof ProgressPrimitive.Label>) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

/* ------------------------------ Progress Value ------------------------------ */

function ProgressValue({
  className,
  ...props
}: WithClassName<typeof ProgressPrimitive.Value>) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn(
        "col-start-2 text-right text-sm text-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Progress Track ------------------------------ */

function ProgressTrack({
  className,
  ...props
}: WithClassName<typeof ProgressPrimitive.Track>) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn(
        "col-span-full h-1 overflow-hidden rounded bg-accent",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Progress Indicator ------------------------------ */

function ProgressIndicator({
  className,
  ...props
}: WithClassName<typeof ProgressPrimitive.Indicator>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full w-full bg-primary transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Progress Component ------------------------------ */

type ProgressComponent = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  label: string;
};

function Progress({ label, ...props }: ProgressComponent) {
  return (
    <ProgressRoot {...props}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const ProgressExports = Object.assign(Progress, {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
});

export {
  ProgressExports as Progress,
  ProgressRoot,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
};
