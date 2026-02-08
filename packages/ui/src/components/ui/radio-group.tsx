import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@/lib/utils";

function RadioRoot({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "flex size-4 items-center justify-center rounded-full data-checked:bg-foreground data-unchecked:border",
        "state-focus-ring state-invalid",
        className,
      )}
      {...props}
    >
      <RadioIndicator />
    </RadioPrimitive.Root>
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
        className,
      )}
      {...props}
    />
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

const RadioExports = Object.assign(RadioRoot, {
  Group: RadioGroup,
});

export { RadioExports as Radio, RadioGroup };
