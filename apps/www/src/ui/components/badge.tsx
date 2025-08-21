import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "from-primary/85 to-primary text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t border border-zinc-50/50 shadow-md shadow-zinc-950/20 ring-0 transition-[filter] duration-200 dark:border-0 dark:border-zinc-950/50",
        outline: "border bg-secondary text-secondary-foreground",
        background:
          "border border-transparent bg-transparent text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
};

export { Badge, badgeVariants };
