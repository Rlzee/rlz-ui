"use client";

import type * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@rlz/ui/lib/cn";

const defaultClass = cn(
  "px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none rounded-md font-medium transition-all",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  "state-focus-ring state-invalid"
);

const buttonVariants = cva(defaultClass, {
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/80",
      outline: "bg-secondary border hover:bg-accent",
      secondary: "bg-accent text-secondary-foreground hover:bg-accent/70",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
      destructive:
        "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
    },
    size: {
      xs: "h-7 px-2 has-[>svg]:px-1.5 text-xs",
      sm: "h-8 px-3 has-[>svg]:px-2.5 text-sm",
      md: "h-9 has-[>svg]:px-3 text-sm",
      lg: "h-10 has-[>svg]:px-4 text-base",
      xl: "h-11 has-[>svg]:px-6 text-lg",

      "icon-xs": "size-7 [&>svg:not([class*='size-'])]:size-3.5",
      "icon-sm": "size-8 [&>svg:not([class*='size-'])]:size-4",
      "icon-md": "size-9 [&>svg:not([class*='size-'])]:size-4",
      "icon-lg": "size-10 [&>svg:not([class*='size-'])]:size-5",
      "icon-xl": "size-11 [&>svg:not([class*='size-'])]:size-6",
    },
  },
});

type ButtonProps = useRender.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    "data-slot": "button",
    className: cn(buttonVariants({ className, size, variant })),
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

export { Button, buttonVariants, type ButtonProps };
