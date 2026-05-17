"use client";

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cn } from "@rlz/ui/lib/cn";

function FieldsetRoot({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

function FieldsetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="fieldset-header"
      className={cn("grid gap-0.5", className)}
      {...props}
    />
  );
}

function FieldsetLegend({
  className,
  ...props
}: FieldsetPrimitive.Legend.Props) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="fieldset-legend"
      className={cn(
        "text-lg text-card-foreground leading-none font-semibold",
        className
      )}
      {...props}
    />
  );
}

function FieldsetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="fieldset-description"
      className={cn("ui-description", className)}
      {...props}
    />
  );
}

const FieldsetExports = Object.assign(FieldsetRoot, {
  Header: FieldsetHeader,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
});

export {
  FieldsetExports as Fieldset,
  FieldsetHeader,
  FieldsetLegend,
  FieldsetDescription,
};
