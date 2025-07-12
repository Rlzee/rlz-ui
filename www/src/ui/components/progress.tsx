"use client";

import { ComponentProps } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/src/lib/utils";

const Progress = ({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-secondary relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="from-primary/85 to-primary text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-zinc-50/50 shadow-md shadow-zinc-950/20 ring-0 active:brightness-95 dark:border-0 dark:border-zinc-950/50 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
};

export { Progress };
