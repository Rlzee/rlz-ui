"use client";

import { ComponentProps, createContext, useContext, ReactNode } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { toggleVariants } from "./toggle";

/* --------------------------- Toggle Group Context --------------------------- */

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

/* --------------------------- Toggle Group Provider --------------------------- */

const ToggleGroupProvider = ({
  children,
  variant,
  size,
}: VariantProps<typeof toggleVariants> & { children: ReactNode }) => {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  );
};

/* --------------------------- Root Toggle Group --------------------------- */

const ToggleGroup = ({
  className,
  variant,
  size,
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) => {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md",
        className
      )}
      {...props}
    >
      <ToggleGroupProvider variant={variant} size={size}>
        {children}
      </ToggleGroupProvider>
    </ToggleGroupPrimitive.Root>
  );
};

/* --------------------------- Toggle Group Item --------------------------- */

const ToggleGroupItem = ({
  className,
  children,
  variant,
  size,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
};

/* --------------------------- Exports --------------------------- */

const ToggleGroupComposed = Object.assign(ToggleGroup, {
  Provider: ToggleGroupProvider,
  Item: ToggleGroupItem,
});

export {
  ToggleGroupComposed as ToggleGroup,
  ToggleGroupProvider,
  ToggleGroupItem,
};
