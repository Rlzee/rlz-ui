"use client";

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@rlz/ui/lib/cn";
import type { InputProps } from "@rlz/ui/components/ui/input";

function InputGroupRoot({
  variant = "primary",
  focusVisible = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  focusVisible?: boolean;
  variant?: InputProps["variant"];
}) {
  return (
    <div
      data-slot="input-group"
      role="group"
      data-variant={variant}
      className={cn(
        "data-[variant=primary]:bg-input data-[variant=secondary]:bg-accent/60",
        "group/input-group relative inline-flex w-full px-3 h-9 min-w-0 items-center rounded-md border not-dark:bg-clip-padding text-base md:text-sm shadow-xs transition-[color,box-shadow]",
        "has-[input:disabled,textarea:disabled]:cursor-not-allowed has-[input:disabled,textarea:disabled]:opacity-50",

        focusVisible && [
          "has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/20 dark:has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:ring-destructive/40 has-[input:focus-visible,textarea:focus-visible]:has-[input[aria-invalid],textarea[aria-invalid]]:border-destructive",
          "has-[input:focus-visible,textarea:focus-visible]:ring-ring/50 has-[input:focus-visible,textarea:focus-visible]:ring-[2px] has-[input:focus-visible,textarea:focus-visible]:border-ring",
        ],

        // textarea
        "has-[textarea]:h-auto **:[textarea]:min-h-20.5 **:[textarea]:resize-none **:[textarea]:max-sm:min-h-23.5",
        // block
        "has-data-[align=block-end]:h-auto has-data-[align=block-end]:flex-col",
        "has-data-[align=block-start]:h-auto has-data-[align=block-start]:flex-col", //has-data-[align=block-start]:**:[input]:pb-1.5
        "has-[[data-align=block-start],[data-align=block-end]]:**:[input]:h-auto",
        // inline-start - inline-end
        "has-data-[align=inline-start]:[&_input]:ps-2 has-data-[align=inline-end]:[&_input]:pe-2",
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground [&_svg]:-mx-0.5 [&:not(:has(>button))_svg]:text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 leading-none font-medium select-none [&>svg:not([class*='size-'])]:size-4 group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start":
          "order-first has-[>button]:ml-[-0.50rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last has-[>button]:mr-[-0.50rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start pt-2 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "order-last w-full justify-start pb-2 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']"
        );
        if (isInteractive) return;
        e.preventDefault();
        const parent = e.currentTarget.parentElement;
        const input = parent?.querySelector<
          HTMLInputElement | HTMLTextAreaElement
        >("input, textarea");
        if (input && !parent?.querySelector("input:focus, textarea:focus")) {
          input.focus();
        }
      }}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group-text"
      className={cn(
        "inline-flex items-center text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

const InputGroupExports = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
  Text: InputGroupText,
});

export { InputGroupExports as InputGroup, InputGroupAddon };
