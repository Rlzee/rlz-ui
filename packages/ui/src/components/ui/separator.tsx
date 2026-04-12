import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "@/lib/cn";

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch",
        className
      )}
      {...props}
    />
  );
}
