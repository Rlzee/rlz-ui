"use client";

import { ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

const Checkbox = ({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
       className={cn(
        "data-[state=checked]:from-primary/85 data-[state=checked]:to-primary data-[state=checked]:text-primary-foreground data-[state=checked]:inset-shadow-2xs data-[state=checked]:inset-shadow-white/25 data-[state=checked]:bg-linear-to-b data-[state=checked]:dark:from-primary/75 data-[state=checked]:dark:bg-linear-to-t border data-[state=checked]:border-zinc-50/50 data-[state=checked]:shadow-md data-[state=checked]:shadow-zinc-950/20 ring-0 transition-[filter] duration-200 data-[state=checked]:dark:border-0 data-[state=checked]:dark:border-zinc-950/50",
        "bg-secondary border border-border",
        "peer size-4 shrink-0 rounded-[4px] outline-none transition-shadow focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox };
