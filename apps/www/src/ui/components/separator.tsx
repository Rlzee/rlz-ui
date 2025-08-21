import { ComponentProps } from "react";
import { cn } from "@ui/lib/utils";

interface SeparatorProps extends ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

const Separator = ({
  className,
  orientation = "vertical",
  ...props
}: SeparatorProps) => {
  return (
    <div
      role="separator"
      data-slot="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "vertical"
          ? "w-px h-6 bg-border"
          : "h-px w-full bg-border",
        className
      )}
      {...props}
    />
  );
};

export { Separator };
