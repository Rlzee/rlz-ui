"use client";

import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cn } from "@rlz/ui/lib/cn";

function FieldsetRoot({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="fieldset-root"
      className={cn(
        "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
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
      className={cn("mb-3 font-medium text-base", className)}
      {...props}
    />
  );
}

const FieldsetExports = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend,
});

export { FieldsetExports as Fieldset, FieldsetLegend };
