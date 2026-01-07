import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* --------------------------- Toggle Group Context --------------------------- */

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

/* --------------------------- Toggle Group Provider --------------------------- */

type ToggleGroupProviderProps = VariantProps<typeof toggleVariants> & {
  children: React.ReactNode;
};

function ToggleGroupProvider({
  children,
  variant,
  size,
}: ToggleGroupProviderProps) {
  return (
    <ToggleGroupContext.Provider
      data-slot="toggle-group-provider"
      value={{ variant, size }}
    >
      {children}
    </ToggleGroupContext.Provider>
  );
}

/* --------------------------- Root Toggle Group --------------------------- */

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive> &
  VariantProps<typeof toggleVariants>;

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex items-center rounded-md data-[variant=outline]:bg-secondary data-[variant=outline]:border data-[variant=outline]:gap-0 gap-1",
        className
      )}
      {...props}
    >
      <ToggleGroupProvider variant={variant} size={size}>
        {children}
      </ToggleGroupProvider>
    </ToggleGroupPrimitive>
  );
}

/* ------------------------------ Toggle Group Item ------------------------------ */

type ToggleProps = React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>;

function ToggleGroupItem({ className, variant, size, ...props }: ToggleProps) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant || context.variant}
      data-size={size || context.size}
      className={cn(
        toggleVariants({
          variant: variant || context.variant,
          size: size || context.size,
        }),
        "min-w-0 flex-1 shrink-0 data-[variant=outline]:rounded-none shadow-none focus:z-10 focus-visible:z-10 border-none data-[variant=outline]:last:rounded-r-md data-[variant=outline]:first:rounded-l-md rounded-md",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const ToggleGroupExport = Object.assign(ToggleGroup, {
  Provider: ToggleGroupProvider,
  Item: ToggleGroupItem,
});

export {
  ToggleGroupExport as ToggleGroup,
  ToggleGroupProvider,
  ToggleGroupItem,
};
