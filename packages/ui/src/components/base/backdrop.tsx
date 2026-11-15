import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const backdropVariants = cva(
  "z-50 fixed inset-0 min-h-dvh transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute",
  {
    variants: {
      blur: {
        true: "backdrop-blur-xs bg-background/32",
        false: "opacity-20 dark:opacity-70 bg-background",
      },
    },
    defaultVariants: {
      blur: true,
    },
  },
);

export function Backdrop({
  blur = true,
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof backdropVariants>) {
  return (
    <div
      data-slot="backdrop"
      className={cn(backdropVariants({ blur }), className)}
      {...props}
    />
  );
}
