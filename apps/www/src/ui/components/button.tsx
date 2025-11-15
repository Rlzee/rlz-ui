import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";

export type buttonVariantTypes =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-border focus-visible:ring-muted focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-radial-[at_52%_-52%] **:[text-shadow:0_1px_0_var(--color-primary)] from-primary/70 to-primary/95 text-primary-foreground inset-shadow-2xs inset-shadow-white/25 bg-linear-to-b dark:from-primary/75 dark:bg-linear-to-t dark:to-primary border border-primary shadow-md ring-0 transition-[filter] duration-200 hover:brightness-110 active:brightness-95 dark:border-0 dark:border-zinc-950/50 shadow-md shadow-zinc-950/30",
        secondary:
          "bg-secondary border-border text-secondary-foreground shadow-xs dark:hover:bg-secondary/80 hover:brightness-95",
        outline:
          "border border-border bg-secondary text-secondary-foreground dark:hover:bg-secondary/80 hover:brightness-95",
        ghost:
          "hover:bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 hover:opacity-80 text-destructive-foreground",
        link: "hover:text-foreground data-[active=true]:text-primary text-muted-foreground hover:underline underline-offset-4",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = {
  asChild?: boolean;
} & ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
