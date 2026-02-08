import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "md",
  variant: "default",
});

function ToggleGroupProvider({
  children,
  variant,
  size,
}: VariantProps<typeof toggleVariants> & {
  children: React.ReactNode;
}) {
  return (
    <ToggleGroupContext.Provider
      data-slot="toggle-group-provider"
      value={{ variant, size }}
    >
      {children}
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex items-center rounded-md data-[variant=outline]:bg-secondary data-[variant=outline]:border data-[variant=outline]:gap-0 gap-1",
        className,
      )}
      {...props}
    >
      <ToggleGroupProvider variant={variant} size={size}>
        {children}
      </ToggleGroupProvider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
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
        className,
      )}
      {...props}
    />
  );
}

const ToggleGroupExport = Object.assign(ToggleGroup, {
  Provider: ToggleGroupProvider,
  Item: ToggleGroupItem,
});

export {
  ToggleGroupExport as ToggleGroup,
  ToggleGroupProvider,
  ToggleGroupItem,
};
