"use client";

import { ComponentProps, createContext, useContext, ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { buttonVariants } from "./button";
import { Slot } from "@radix-ui/react-slot";

/* --------------------------- Context Button Group --------------------------- */

const ButtonGroupContext = createContext<VariantProps<typeof buttonVariants>>({
  size: "default",
  variant: "primary",
});

/* --------------------------- Button Group Provider --------------------------- */

const ButtonGroupProvider = ({
  children,
  variant,
  size,
}: VariantProps<typeof buttonVariants> & { children: ReactNode }) => {
  return (
    <ButtonGroupContext.Provider value={{ variant, size }}>
      {children}
    </ButtonGroupContext.Provider>
  );
};

/* --------------------------- Root Button Group --------------------------- */

interface ButtonGroupProps
  extends ComponentProps<"div">,
    VariantProps<typeof buttonVariants> {}

const ButtonGroup = ({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonGroupProps) => {
  return (
    <div
      data-slot="button-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/button-group flex w-fit items-center rounded-md",
        className
      )}
      {...props}
    >
      <ButtonGroupProvider variant={variant} size={size}>
        {children}
      </ButtonGroupProvider>
    </div>
  );
};

/* --------------------------- Button Group Item --------------------------- */

interface ButtonGroupItemProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonGroupItem = ({
  className,
  variant,
  asChild = false,
  size,
  ...props
}: ButtonGroupItemProps) => {
  const Comp = asChild ? Slot : "button";
  const context = useContext(ButtonGroupContext);

  return (
    <Comp
      data-slot="button-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        buttonVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    />
  );
};

/* --------------------------- Exports --------------------------- */

const ButtonGroupComposed = Object.assign(ButtonGroup, {
  Provider: ButtonGroupProvider,
  Item: ButtonGroupItem,
});

export {
  ButtonGroupComposed as ButtonGroup,
  ButtonGroupProvider,
  ButtonGroupItem,
};
