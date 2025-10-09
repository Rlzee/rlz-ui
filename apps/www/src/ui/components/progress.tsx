import { ComponentProps } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Progress ------------------------------ */

const ProgressRoot = ({
  children,
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number | null;
}) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={undefined}
      aria-valuenow={value ?? undefined}
      className={cn(
        "bg-secondary relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </ProgressPrimitive.Root>
  );
};

/* ------------------------------ Progress Indicator ------------------------------ */

const ProgressIndicator = ({
  className,
  value = 0,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Indicator> & {
  value?: number | null;
}) => {
  const safeValue = Math.min(Math.max(value ?? 0, 0), 100); // clamp + fallback

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "from-primary/85 to-primary text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-zinc-50/50 shadow-md shadow-zinc-950/20 ring-0 active:brightness-95 dark:border-0 dark:border-zinc-950/50 h-full w-full flex-1 transition-all",
        className
      )}
      style={{ transform: `translateX(-${100 - safeValue}%)` }}
      {...props}
    />
  );
};

/* ------------------------------ Progress ------------------------------ */

const Progress = ({
  className,
  value,
  ...props
}: ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number | null;
}) => {
  return (
    <ProgressRoot className={className} value={value} {...props}>
      <ProgressIndicator value={value} />
    </ProgressRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const ProgressComposed = Object.assign(Progress, {
  Root: ProgressRoot,
  Indicator: ProgressIndicator,
});

export { ProgressComposed as Progress, ProgressRoot, ProgressIndicator };
