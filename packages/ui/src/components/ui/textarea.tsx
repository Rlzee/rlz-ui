"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "cn";
import type * as React from "react";
import { inputVariants, type InputVariant } from "./input";

type TextareaProps = React.ComponentProps<"textarea"> &
  React.RefAttributes<HTMLTextAreaElement> & {
    unstyled?: boolean;
    variant?: InputVariant;
  };

function Textarea({
  variant = "primary",
  unstyled = false,
  className,
  ref,
  ...props
}: TextareaProps) {
  return (
    <span
      data-slot="textarea-control"
      data-variant={variant}
      className={cn(
        inputVariants({ variant, unstyled }),
        !unstyled && "h-auto items-stretch text-base md:text-sm",
        className,
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
              !unstyled && "px-3",
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
