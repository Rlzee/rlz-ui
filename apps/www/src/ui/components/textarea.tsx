import * as React from "react";
import { cn } from "@ui/lib/utils";

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border border-border bg-secondary placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-border focus-visible:ring-muted focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
};

export { Textarea };
