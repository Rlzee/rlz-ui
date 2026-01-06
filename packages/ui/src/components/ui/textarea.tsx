import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full px-3 py-2 flex field-sizing-content rounded-md border bg-input text-base placeholder:text-muted-foreground transition-[color,box-shadow] outline-none md:text-sm",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "state-invalid state-focus-ring",
        className
      )}
      {...props}
    />
  );
}
