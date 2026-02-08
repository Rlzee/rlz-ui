import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cn } from "@/lib/utils";
import { Check as CheckIcon, type LucideIcon } from "lucide-react";

function CheckboxRoot({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "relative inline-flex bg-background border peer size-4 shrink-0 rounded-sm outline-none transition-shadow",
        "data-checked:bg-primary data-checked:text-primary-foreground border data-checked:shadow-md ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "state-focus-ring state-invalid",
        className,
      )}
      {...props}
    />
  );
}

function CheckboxIndicator({
  className,
  ...props
}: CheckboxPrimitive.Indicator.Props) {
  return (
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn(
        "-inset-px absolute flex items-center justify-center rounded-sm text-primary-foreground",
        "data-unchecked:hidden data-checked:bg-primary data-indeterminate:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CheckboxIcon({
  icon: Icon = CheckIcon,
  className,
}: React.ComponentProps<LucideIcon> & {
  icon?: LucideIcon;
}) {
  return (
    <Icon
      data-slot="checkbox-icon"
      className={cn(
        "size-3.5 text-primary-foreground flex items-center justify-center",
        className,
      )}
    />
  );
}

function Checkbox(props: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxRoot {...props}>
      <CheckboxIndicator>
        <CheckboxIcon />
      </CheckboxIndicator>
    </CheckboxRoot>
  );
}

function CheckboxGroup({ className, ...props }: CheckboxGroupPrimitive.Props) {
  return (
    <CheckboxGroupPrimitive
      className={cn("flex flex-col items-start gap-2", className)}
      {...props}
    />
  );
}

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
