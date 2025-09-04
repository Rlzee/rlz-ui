import { ComponentProps } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Switch ------------------------------ */

const SwitchRoot = ({
  children,
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "data-[state=checked]:from-primary/85 data-[state=checked]:to-primary data-[state=checked]:text-primary-foreground data-[state=checked]:inset-shadow-2xs data-[state=checked]:inset-shadow-white/25 data-[state=checked]:bg-linear-to-b data-[state=checked]:dark:from-primary/75 data-[state=checked]:dark:bg-linear-to-t border data-[state=checked]:border-zinc-50/50 data-[state=checked]:shadow-md data-[state=checked]:shadow-zinc-950/20 ring-0 transition-[filter] duration-200 data-[state=checked]:dark:border-0 data-[state=checked]:dark:border-zinc-950/50",
        "peer focus-visible:border-ring focus-visible:ring-ring/50 data-[state=unchecked]:bg-secondary inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </SwitchPrimitive.Root>
  );
};

/* ------------------------------ Switch Thumb ------------------------------ */

const SwitchThumb = ({
  className,
}: ComponentProps<typeof SwitchPrimitive.Thumb>) => {
  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "data-[state=unchecked]:bg-background dark:data-[state=unchecked]:bg-foreground data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        className
      )}
    />
  );
};

/* ------------------------------ Switch ------------------------------ */

const Switch = ({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) => {
  return (
    <SwitchRoot className={className} {...props}>
      <SwitchThumb />
    </SwitchRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const SwitchComposed = Object.assign(Switch, {
  Root: SwitchRoot,
  Thumb: SwitchThumb,
});

export { SwitchComposed as Switch, SwitchRoot, SwitchThumb };
