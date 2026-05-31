"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext } from "react";
import { cn } from "@rlz/ui/lib/cn";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm text-muted-foreground font-medium bg-transparent hover:bg-accent/70 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-[color,box-shadow] outline-none state-invalid state-focus-ring whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "data-[pressed]:bg-accent data-[pressed]:text-foreground",
        outline: [
          "border border-border bg-secondary data-[pressed]:bg-accent data-[pressed]:text-foreground",
          // horizontal (défaut)
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:not-last:border-r-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:first:rounded-r-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:last:rounded-l-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:not-first:not-last:rounded-none",
          // vertical
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:not-last:border-b-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:first:rounded-b-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:last:rounded-t-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:not-first:not-last:rounded-none",
        ],
      },
      size: {
        xs: "h-7 px-1 min-w-7",
        sm: "h-8 px-1.5 min-w-8",
        md: "h-9 px-2 min-w-9",
        lg: "h-10 px-2.5 min-w-10",
        xl: "h-11 px-3 min-w-11",
        "icon-xs": "h-7 w-7 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-md": "h-9 w-9 p-0",
        "icon-lg": "h-10 w-10 p-0",
        "icon-xl": "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type ToggleVariants = VariantProps<typeof toggleVariants>;
const ToggleGroupContext = createContext<ToggleVariants>({});

function ToggleRoot({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & ToggleVariants) {
  const ctx = useContext(ToggleGroupContext);
  const resolvedVariant = ctx.variant !== undefined ? ctx.variant : variant;
  const resolvedSize = ctx.size !== undefined ? ctx.size : size;
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(
        toggleVariants({
          className,
          variant: resolvedVariant,
          size: resolvedSize,
        })
      )}
      {...props}
    />
  );
}

function ToggleGroup({
  className,
  variant = "default",
  size = "md",
  orientation = "horizontal",
  ...props
}: ToggleGroupPrimitive.Props & ToggleVariants) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        data-variant={variant}
        data-orientation={orientation}
        className={cn(
          "flex items-center gap-0.5",
          "data-[variant=outline]:gap-0",
          "data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      />
    </ToggleGroupContext.Provider>
  );
}

const ToggleExports = Object.assign(ToggleRoot, {
  Group: ToggleGroup,
});

export { ToggleExports as Toggle, ToggleGroup };
