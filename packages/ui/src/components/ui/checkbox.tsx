"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cn } from "@rlz/ui/lib/cn";
import { Check, Minus } from "lucide-react";

function CheckboxRoot({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "relative inline-flex bg-background border peer size-4 shrink-0 rounded-sm outline-none transition-shadow",
        "data-checked:bg-primary data-checked:text-primary-foreground border data-checked:shadow-md ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "state-focus-ring state-invalid",
        className
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
        "data-unchecked:hidden data-checked:bg-primary",
        className
      )}
      {...props}
    />
  );
}

function CheckboxIcon({
  icon: Icon = Check,
  className,
}: {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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

function Checkbox({
  icon: Icon = Check,
  indeterminateIcon: IndeterminateIcon = Minus,
  ...props
}: CheckboxPrimitive.Root.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  indeterminateIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <CheckboxRoot {...props}>
      <CheckboxIndicator
        render={(
          props: React.ComponentProps<"span">,
          state: CheckboxPrimitive.Indicator.State
        ) => (
          <span {...props}>
            {state.indeterminate ? (
              <CheckboxIcon icon={IndeterminateIcon} className="text-primary" />
            ) : (
              <CheckboxIcon icon={Icon} />
            )}
          </span>
        )}
      />
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
