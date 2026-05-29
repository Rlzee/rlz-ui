"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@rlz/ui/lib/cn";

function ProgressRoot({ className, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn("text-right text-sm text-foreground", className)}
      {...props}
    />
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn(
        "col-span-full h-1.5 overflow-hidden rounded bg-accent",
        className
      )}
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
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

function Progress({ children, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressRoot {...props}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressRoot>
  );
}

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
