"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@rlz/ui/lib/cn";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex gap-3", className)}
      {...props}
    />
  );
}

function FieldRoot({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("grid gap-1.5", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "inline-flex items-center justify-between text-sm font-medium text-foreground leading-none select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function FieldControl(props: FieldPrimitive.Control.Props) {
  return <FieldPrimitive.Control data-slot="field-control" {...props} />;
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("ui-description", className)}
      {...props}
    />
  );
}

function FieldItem({ className, ...props }: FieldPrimitive.Item.Props) {
  return (
    <FieldPrimitive.Item
      data-slot="field-item"
      className={cn("flex", className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    />
  );
}

function FieldValidity(props: FieldPrimitive.Validity.Props) {
  return <FieldPrimitive.Validity data-slot="field-validity" {...props} />;
}

const FieldExports = Object.assign(FieldRoot, {
  Group: FieldGroup,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Item: FieldItem,
  Error: FieldError,
  Validity: FieldValidity,
});

export {
  FieldExports as Field,
  FieldGroup,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldItem,
  FieldError,
  FieldValidity,
};
