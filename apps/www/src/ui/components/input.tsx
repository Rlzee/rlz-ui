import { ComponentProps } from "react";
import { cn } from "@ui/lib/utils";

const Input = ({
  className,
  type = "text",
  ...props
}: ComponentProps<"input">) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border border-border file:text-foreground placeholder:text-muted-foreground selection:text-secondary-foreground bg-secondary flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:shadow-none shadow-xs",
        "focus-visible:border-border focus-visible:ring-muted focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
};

export { Input };
