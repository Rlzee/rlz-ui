"use client";

import { cn } from "@/src/lib/utils";
import { ComponentProps } from "react";

type Orientation = "horizontal" | "vertical";

interface SeparatorProps extends ComponentProps<"div"> {
  orientation?: Orientation;
  className?: string;
}

const SeparatorBorder = ({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      data-slot="separator-border"
      className={cn(
        isHorizontal ? "w-full h-6 border-y" : "h-full w-6 border-x",
        "relative z-[1] border-border",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          "before:content-[''] before:absolute before:inset-0",
          "before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)]"
        )}
      />
    </div>
  );
};

export { SeparatorBorder };
