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
        default: "px-3 data-[pressed]:bg-accent data-[pressed]:text-foreground",
        outline: [
          "px-3 border border-border bg-secondary data-[pressed]:bg-accent data-[pressed]:text-foreground",
          // horizontal (défaut)
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:not-last:border-r-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:not-first:border-l-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:first:rounded-r-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:last:rounded-l-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=horizontal]:not-first:not-last:rounded-none",
          // vertical
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:not-last:border-b-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:not-first:border-t-0",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:first:rounded-b-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:last:rounded-t-none",
          "in-data-[slot=toggle-group]:in-data-[orientation=vertical]:not-first:not-last:rounded-none",
        ],
      },
      size: {
        xs: "h-7 px-2 has-[>svg]:px-1.5 text-xs",
        sm: "h-8 has-[>svg]:px-2.5 text-sm",
        md: "h-9 has-[>svg]:px-3 text-sm",
        lg: "h-10 px-4 has-[>svg]:px-4 text-base",
        xl: "h-11 px-4 has-[>svg]:px-6 text-lg",

        "icon-xs": "size-7 [&>svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&>svg:not([class*='size-'])]:size-4",
        "icon-md": "size-9 [&>svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10 [&>svg:not([class*='size-'])]:size-5",
        "icon-xl": "size-11 [&>svg:not([class*='size-'])]:size-6",
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
  variant = "default",
  size = "md",
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

function ToggleGroupSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="group-separator"
      className={cn(
        "pointer-events-none relative z-2 shrink-0 bg-border",
        "in-data-[orientation=horizontal]:self-stretch in-data-[orientation=horizontal]:w-px",
        "in-data-[orientation=vertical]:h-px in-data-[orientation=vertical]:w-full",
        className
      )}
      {...props}
    />
  );
}

const ToggleExports = Object.assign(ToggleRoot, {
  Group: ToggleGroup,
  GroupSeparator: ToggleGroupSeparator,
});

export { ToggleExports as Toggle, ToggleGroup, ToggleGroupSeparator };
