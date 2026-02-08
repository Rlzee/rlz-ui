import type * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const defaultClass = cn(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none rounded-md text-sm font-medium transition-all",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  "state-focus-ring state-invalid",
);

const buttonVariants = cva(defaultClass, {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/80",
      outline: "bg-secondary border hover:bg-accent",
      secondary: "bg-accent text-secondary-foreground hover:bg-accent/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
      destructive:
        "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
    },
    size: {
      xs: "h-7 rounded-md px-2 has-[>svg]:px-1.5",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      xl: "h-11 rounded-lg px-8 has-[>svg]:px-6",

      "icon-xs": "h-7 w-7 p-0",
      "icon-sm": "h-8 w-8 p-0",
      "icon-md": "h-9 w-9 p-0",
      "icon-lg": "h-10 w-10 p-0",
      "icon-xl": "h-11 w-11 p-0",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
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

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants, type ButtonProps };
