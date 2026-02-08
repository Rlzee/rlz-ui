import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Fieldset ------------------------------ */

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

/* ------------------------------ Fieldset Legend ------------------------------ */

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

/* ------------------------------ Exports ------------------------------ */

const FieldsetExports = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend,
});

export { FieldsetExports as Fieldset, FieldsetLegend };
