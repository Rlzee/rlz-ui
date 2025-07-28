import { cn } from "@/src/lib/utils";

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
      <span className="shrink-0 px-4 text-muted-foreground">{children}</span>
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
