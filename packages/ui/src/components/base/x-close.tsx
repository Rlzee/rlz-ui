import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type XcloseProps<T extends React.ElementType> = React.ComponentProps<T> & {
  baseComponent: T;
};

export function Xclose<T extends React.ElementType>({
  baseComponent: Close,
  className,
  ...props
}: XcloseProps<T>) {
  return (
    <Close
      data-slot="x-close-button"
      className={cn(
        "ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none",
        "data-open:bg-accent data-open:text-muted-foreground",
        "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </Close>
  );
}
