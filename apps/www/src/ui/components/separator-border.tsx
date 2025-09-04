import { ComponentProps } from "react";
import { cn } from "@ui/lib/utils";

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
      className={cn(
        isHorizontal ? "w-full h-6 border-y" : "h-full w-6 border-x",
        "relative z-[1] border-border",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="diagonalHatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
            >
              <path d="M0,6 L6,0" stroke="var(--border)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
        </svg>
      </div>
    </div>
  );
};

export { SeparatorBorder };
