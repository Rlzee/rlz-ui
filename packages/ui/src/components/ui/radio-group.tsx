import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Radio ------------------------------ */

function RadioRoot({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "flex size-5 items-center justify-center rounded-full data-checked:bg-foreground data-unchecked:border",
        "state-invalid",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Radio Indicator ------------------------------ */

function RadioIndicator({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Indicator>) {
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

/* ------------------------------ Radio Group ------------------------------ */

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const RadioExports = Object.assign(RadioRoot, {
  Indicator: RadioIndicator,
  Group: RadioGroup,
});

export { RadioExports as Radio, RadioIndicator, RadioGroup };
