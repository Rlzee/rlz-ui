"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { createContext, useContext } from "react";
import { Group, GroupSeparator } from "./group";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm text-muted-foreground font-medium bg-transparent hover:bg-accent/70 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-[color,box-shadow] outline-none state-invalid state-focus-ring whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "px-3 data-[pressed]:bg-accent data-[pressed]:text-foreground",
        outline:
          "px-3 border border-border bg-secondary data-[pressed]:bg-accent data-[pressed]:text-foreground",
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
  },
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
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(
        toggleVariants({
          variant: ctx.variant ?? variant,
          size: ctx.size ?? size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroup({
  variant = "default",
  size = "md",
  orientation = "horizontal",
  className,
  ...props
}: ToggleGroupPrimitive.Props & ToggleVariants) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive
        orientation={orientation}
        render={(renderProps) => (
          <Group
            {...renderProps}
            orientation={orientation}
            attached={variant === "outline"}
            className={cn(renderProps.className, className)}
          />
        )}
        {...props}
      />
    </ToggleGroupContext.Provider>
  );
}

const ToggleExports = Object.assign(ToggleRoot, {
  Group: ToggleGroup,
  GroupSeparator,
});

export {
  ToggleExports as Toggle,
  ToggleGroup,
  GroupSeparator as ToggleGroupSeparator,
};
