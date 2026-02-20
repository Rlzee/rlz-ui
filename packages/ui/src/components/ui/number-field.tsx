import * as React from "react";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { Label } from "@/components/ui/label";
import { Minus as MinusIcon, Plus as PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NumberFieldContext = React.createContext<{
  fieldId: string;
} | null>(null);

function NumberFieldRoot({
  id,
  className,
  ...props
}: NumberFieldPrimitive.Root.Props) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <NumberFieldContext.Provider value={{ fieldId }}>
      <NumberFieldPrimitive.Root
        id={fieldId}
        data-slot="number-field"
        className={cn("flex flex-col items-start gap-1", className)}
        {...props}
      />
    </NumberFieldContext.Provider>
  );
}

function NumberFieldScrubArea({
  label,
  scrubAreaCursor = true,
  className,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props & {
  label: string;
  scrubAreaCursor?: boolean;
}) {
  const context = React.useContext(NumberFieldContext);

  if (!context) {
    throw new Error(
      "NumberFieldScrubArea must be used within a NumberField component for accessibility."
    );
  }

  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cursor-ew-resize", className)}
      {...props}
    >
      <Label className="cursor-ew-resize" htmlFor={context.fieldId}>
        {label}
      </Label>
      {scrubAreaCursor && <NumberFieldScrubAreaCursor />}
    </NumberFieldPrimitive.ScrubArea>
  );
}

function NumberFieldScrubAreaCursor({
  cursor: Cursor = CursorGrowIcon,
  ...props
}: NumberFieldPrimitive.ScrubAreaCursor.Props & {
  cursor?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <NumberFieldPrimitive.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      {...props}
    >
      <Cursor className="h-4 w-4" />
    </NumberFieldPrimitive.ScrubAreaCursor>
  );
}

function CursorGrowIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="black"
      height="14"
      stroke="white"
      viewBox="0 0 24 14"
      width="26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn("flex", className)}
      {...props}
    />
  );
}

function NumberFieldDecrement({
  className,
  icon: Icon = MinusIcon,
  ...props
}: NumberFieldPrimitive.Decrement.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(
        "flex h-9 px-3 items-center justify-center rounded-tl-md rounded-bl-md border bg-accent bg-clip-padding text-secondary-foreground select-none hover:bg-accent/80 active:bg-accent/80",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({
  className,
  icon: Icon = PlusIcon,
  ...props
}: NumberFieldPrimitive.Increment.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(
        "flex h-9 px-3 items-center justify-center rounded-tr-md rounded-br-md border bg-accent bg-clip-padding text-secondary-foreground select-none hover:bg-accent/80 active:bg-accent/80",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </NumberFieldPrimitive.Increment>
  );
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
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
