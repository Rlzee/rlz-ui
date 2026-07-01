"use client";

import type * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@rlz/ui/lib/cn";

type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  unstyled?: boolean;
  nativeInput?: boolean;
  variant?: "primary" | "secondary";
};

function Input({
  variant = "primary",
  unstyled = false,
  nativeInput = false,
  className,
  style,
  ...props
}: InputProps) {
  const inputClassName = cn(
    "placeholder:text-muted-foreground w-full min-w-0 h-9 leading-9 rounded-[inherit] outline-none",
    props.type === "search" &&
      "[&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
    props.type === "file" &&
      "text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground"
  );

  return (
    <span
      data-slot="input-control"
      data-variant={variant}
      className={cn(
        "inline-flex items-center text-sm w-full",
        !unstyled && [
          "h-9 data-[variant=primary]:bg-input data-[variant=secondary]:bg-accent/60",
          "relative w-full rounded-md border not-dark:bg-clip-padding transition-shadow",
          "has-disabled:cursor-not-allowed has-disabled:pointer-events-none has-disabled:opacity-50",
          "has-focus-visible:has-aria-invalid:ring-destructive/20 dark:has-focus-visible:has-aria-invalid:ring-destructive/40 has-focus-visible:has-aria-invalid:border-destructive",
          "has-focus-visible:ring-ring/50 has-focus-visible:ring-[2px] has-focus-visible:border-ring",
        ],
        className
      )}
    >
      {nativeInput ? (
        <input
          data-slot="input"
          className={cn(!unstyled && "px-3", inputClassName)}
          style={typeof style === "function" ? undefined : style}
          {...props}
        />
      ) : (
        <InputPrimitive
          data-slot="input"
          className={cn(!unstyled && "px-3", inputClassName)}
          style={style}
          {...props}
        />
      )}
    </span>
  );
}

export { Input, type InputProps };
