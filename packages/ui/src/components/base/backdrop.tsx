import type * as React from "react";
import { cn } from "@rlz/ui/lib/cn";

type BackdropProps<T extends React.ElementType> = React.ComponentProps<T> & {
  baseComponent: T;
  blur?: boolean;
};

export function Backdrop<T extends React.ElementType>({
  baseComponent: Base,
  blur = true,
  className,
  ...props
}: BackdropProps<T>) {
  return (
    <Base
      className={cn(
        blur
          ? "backdrop-blur-xs bg-background/32"
          : "opacity-20 dark:opacity-70 bg-background",
        "fixed inset-0 min-h-dvh transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute",
        className
      )}
      {...props}
    />
  );
}
