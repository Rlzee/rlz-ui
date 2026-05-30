"use client";

import type * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@rlz/ui/lib/cn";

type TextareaProps = React.ComponentProps<"textarea"> &
  React.RefAttributes<HTMLTextAreaElement> & {
    unstyled?: boolean;
    variant?: "primary" | "secondary";
  };

function Textarea({
  variant = "primary",
  className,
  unstyled = false,
  ref,
  ...props
}: TextareaProps) {
  return (
    <span
      data-slot="textarea-control"
      data-variant={variant}
      className={cn(
        "inline-flex text-sm w-full",
        !unstyled && [
          "data-[variant=primary]:bg-input data-[variant=secondary]:bg-accent/60",
          "relative rounded-md border not-dark:bg-clip-padding text-base md:text-sm transition-[color,box-shadow] shadow-xs",
          "has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:pointer-events-none has-[textarea:disabled]:opacity-50",
          "has-focus-visible:has-aria-invalid:ring-destructive/20 dark:has-focus-visible:has-aria-invalid:ring-destructive/40 has-focus-visible:has-aria-invalid:border-destructive",
          "has-focus-visible:ring-ring/50 has-focus-visible:ring-[2px] has-focus-visible:border-ring",
        ],
        className
      )}
    >
      <FieldPrimitive.Control
        ref={ref}
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        render={(defaultProps: React.ComponentProps<"textarea">) => (
          <textarea
            className={cn(
              "min-h-20.5 max-sm:min-h-23.5 min-w-0 w-full py-2 rounded-[inherit] placeholder:text-muted-foreground outline-none",
              !unstyled && "px-3"
            )}
            data-slot="textarea"
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  );
}

export { Textarea, type TextareaProps };
