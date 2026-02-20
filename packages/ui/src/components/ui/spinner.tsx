import { Loader2 as Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      {...props}
    />
  );
}
