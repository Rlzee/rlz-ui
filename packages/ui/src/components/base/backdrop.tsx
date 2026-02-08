import * as React from "react";
import { cn } from "@/lib/utils";

type BackdropProps<T extends React.ElementType> = React.ComponentProps<T> & {
  baseComponent: T;
  blur?: boolean;
};

export function Backdrop<T extends React.ElementType>({
  baseComponent: Backdrop,
  blur = true,
  className,
  ...props
}: BackdropProps<T>) {
  return (
    <Backdrop
      className={cn(
        blur
          ? "backdrop-blur-sm bg-black/32"
          : "opacity-20 dark:opacity-70 bg-black",
        "fixed inset-0 min-h-dvh transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute",
        className
      )}
      {...props}
    />
  );
}
