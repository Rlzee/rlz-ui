import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-accent text-muted-foreground",
        outline: "border bg-transparent",
        error: "bg-destructive/25 text-destructive [&>svg]:text-destructive",
        info: "bg-info/20 text-info [&>svg]:text-info",
        success: "bg-success/20 text-success [&>svg]:text-success",
        warning: "bg-warning/20 text-warning [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, render, ...props }: BadgeProps) {
  const defaultProps = {
    "data-slot": "badge",
    className: cn(badgeVariants({ className, variant })),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
