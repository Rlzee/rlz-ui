import * as React from "react";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { cn } from "@/lib/utils";

/* --------------------------- Number Field Root -------------------------- */

function NumberFieldRoot({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Root>) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("flex flex-col items-start gap-1", className)}
      {...props}
    />
  );
}

/* --------------------------- Number Field Scrub Area -------------------------- */

function NumberFieldScrubArea({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.ScrubArea>) {
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cursor-ew-resize", className)}
      {...props}
    />
  );
}

/* --------------------------- Number Field Scrub Area Cursor -------------------------- */

function NumberFieldScrubAreaCursor(
  props: React.ComponentProps<typeof NumberFieldPrimitive.ScrubAreaCursor>
) {
  return (
    <NumberFieldPrimitive.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      {...props}
    />
  );
}

/* --------------------------- Number Field Group -------------------------- */

function NumberFieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Group>) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn("flex", className)}
      {...props}
    />
  );
}

/* --------------------------- Number Field Decrement -------------------------- */

type NumberFieldDecrementProps = React.ComponentProps<
  typeof NumberFieldPrimitive.Decrement
> & {
  icon?: React.ReactNode;
};

function NumberFieldDecrement({
  className,
  icon,
  ...props
}: NumberFieldDecrementProps) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(
        "flex size-9 items-center justify-center rounded-tl-md rounded-bl-md border bg-accent bg-clip-padding text-secondary-foreground select-none hover:bg-accent/80 active:bg-accent/80",
        className
      )}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentcolor"
          strokeWidth="1.6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 5H10" />
        </svg>
      )}
    </NumberFieldPrimitive.Decrement>
  );
}

/* --------------------------- Number Field Increment -------------------------- */

type NumberFieldIncrementProps = React.ComponentProps<
  typeof NumberFieldPrimitive.Increment
> & {
  icon?: React.ReactNode;
};

function NumberFieldIncrement({
  className,
  icon,
  ...props
}: NumberFieldIncrementProps) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(
        "flex size-9 items-center justify-center rounded-tr-md rounded-br-md border bg-accent bg-clip-padding text-secondary-foreground select-none hover:bg-accent/80 active:bg-accent/80",
        className
      )}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentcolor"
          strokeWidth="1.6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
        </svg>
      )}
    </NumberFieldPrimitive.Increment>
  );
}

/* --------------------------- Number Field Input -------------------------- */

function NumberFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Input>) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "bg-input h-9 w-24 border-t border-b text-center text-base text-secondary-foreground tabular-nums focus:z-1 outline-none state-invalid",
        className
      )}
      {...props}
    />
  );
}

/* --------------------------- Exports -------------------------- */

const NumberFieldExport = Object.assign(NumberFieldRoot, {
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
  Group: NumberFieldGroup,
  Decrement: NumberFieldDecrement,
  Increment: NumberFieldIncrement,
  Input: NumberFieldInput,
});

export {
  NumberFieldExport as NumberField,
  NumberFieldScrubAreaCursor,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
};
