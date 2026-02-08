import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  unstyled?: boolean;
  variant?: "default" | "background" | "accent";
};

function Textarea({
  variant = "default",
  className,
  unstyled = false,
  ...props
}: TextareaProps) {
  return (
    <span
      data-slot="textarea-control"
      data-variant={variant}
      className={cn(
        !unstyled && [
          "data-[variant=default]:bg-input data-[variant=background]:bg-background data-[variant=accent]:bg-accent",
          "relative inline-flex w-full rounded-md border not-dark:bg-clip-padding text-base md:text-sm transition-[color,box-shadow] shadow-xs",
          "disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50",
          "has-focus-visible:has-aria-invalid:ring-destructive/20 dark:has-focus-visible:has-aria-invalid:ring-destructive/40 has-focus-visible:has-aria-invalid:border-destructive",
          "has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] has-focus-visible:border-ring",
        ],
        className,
      )}
    >
      <FieldPrimitive.Control
        render={(defaultProps) => (
          <textarea
            className="min-h-20.5 max-sm:min-h-23.5 min-w-0 w-full px-3 py-2 flex rounded-[inherit] placeholder:text-muted-foreground outline-none"
            data-slot="textarea"
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  );
}

export { Textarea, type TextareaProps };
