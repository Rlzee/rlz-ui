import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { WithClassNameOmit as WithClassName } from "@/types/ui";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Switch ------------------------------ */

function SwitchRoot({
  className,
  ...props
}: WithClassName<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "data-checked:bg-primary data-checked:text-primary-foreground border data-checked:shadow-md ring-0 transition-[filter] duration-200",
        "peer data-unchecked:bg-accent inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "state-focus-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Switch Thumb ------------------------------ */

function SwitchThumb({
  className,
  ...props
}: WithClassName<typeof SwitchPrimitive.Thumb>) {
  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "data-unchecked:bg-background dark:data-unchecked:bg-foreground data-checked:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Switch ------------------------------ */

function Switch(props: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchRoot {...props}>
      <SwitchThumb />
    </SwitchRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const SwitchComposed = Object.assign(Switch, {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
});

export { SwitchComposed as Switch, SwitchRoot, SwitchThumb };
