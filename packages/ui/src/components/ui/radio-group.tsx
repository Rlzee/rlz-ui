"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@rlz/ui/lib/cn";

function RadioRoot({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "flex size-4 bg-transparent items-center justify-center rounded-full data-checked:bg-foreground data-unchecked:border",
        "state-focus-ring state-invalid data-disabled:opacity-50 data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function RadioIndicator({
  className,
  ...props
}: RadioPrimitive.Indicator.Props) {
  return (
    <RadioPrimitive.Indicator
      data-slot="radio-indicator"
      className={cn(
        "flex before:size-2 before:rounded-full before:bg-background data-unchecked:hidden",
        className
      )}
      {...props}
    />
  );
}

function Radio(props: RadioPrimitive.Root.Props) {
  return (
    <RadioRoot {...props}>
      <RadioIndicator />
    </RadioRoot>
  );
}

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

const RadioExports = Object.assign(Radio, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Group: RadioGroup,
});

export { RadioExports as Radio, RadioRoot, RadioIndicator, RadioGroup };
