import { cn } from "@ui/lib/utils";

type Position = "left" | "right" | "center";

interface DividerProps {
  className?: string;
  position?: Position;
  children?: React.ReactNode;
  gradient?: boolean;
}

const Divider = ({
  className,
  position = "center",
  children,
  gradient = false,
}: DividerProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      {position === "right" || position === "center" ? (
        <div
          className={cn(
            "h-px flex-1",
            gradient
              ? "bg-gradient-to-r from-transparent to-border"
              : "bg-border"
          )}
        ></div>
      ) : null}
      <span
        className={cn(
          "shrink-0 text-muted-foreground",
          position === "center" && "px-4",
          position === "left" && "pr-4",
          position === "right" && "pl-4"
        )}
      >
        {children}
      </span>
      {position === "left" || position === "center" ? (
        <div
          className={cn(
            "h-px flex-1",
            gradient
              ? "bg-gradient-to-l from-transparent to-border"
              : "bg-border"
          )}
        ></div>
      ) : null}
    </div>
  );
};

export { Divider };
