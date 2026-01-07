import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import type { WithClassNameOmit as WithClassName } from "@/types/ui";
import { cn } from "@/lib/utils";
import { Check as CheckIcon, type LucideIcon } from "lucide-react";

/* ------------------------------ Root Checkbox ------------------------------ */

function CheckboxRoot({
  className,
  ...props
}: WithClassName<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "data-checked:bg-primary data-checked:text-primary-foreground border data-checked:shadow-md ring-0 transition-[filter] duration-200",
        "bg-background border border-border",
        "peer size-4 shrink-0 rounded-sm outline-none transition-shadow disabled:cursor-not-allowed disabled:opacity-50",
        "state-invalid state-focus-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Checkbox Indicator ------------------------------ */

function CheckboxIndicator({
  className,
  ...props
}: WithClassName<typeof CheckboxPrimitive.Indicator>) {
  return (
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn(
        "flex items-center justify-center text-current transition-none",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Checkbox Icon ------------------------------ */

function CheckboxIcon({
  icon: Icon = CheckIcon,
  className,
}: {
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Icon
      data-slot="checkbox-icon"
      className={cn(
        "size-3.5 text-primary-foreground flex items-center justify-center",
        className
      )}
    />
  );
}

/* ------------------------------ Checkbox ------------------------------ */

function Checkbox(props: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxRoot {...props}>
      <CheckboxIndicator>
        <CheckboxIcon />
      </CheckboxIndicator>
    </CheckboxRoot>
  );
}

/* --------------------------- Checkbox Group --------------------------- */

function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxGroupPrimitive>) {
  return (
    <CheckboxGroupPrimitive
      className={cn("flex flex-col items-start gap-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const CheckboxExport = Object.assign(Checkbox, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Icon: CheckboxIcon,
  Group: CheckboxGroup,
});

export {
  CheckboxExport as Checkbox,
  CheckboxRoot,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxGroup,
};
