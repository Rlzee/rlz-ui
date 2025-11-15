import { cn } from "@ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/* ------------------------------ Empty ------------------------------ */

const Empty = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ------------------------------ Empty Icon ------------------------------ */

const emptyIconVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        secondary:
          "mb-2 bg-background-secondary text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-12 [&_svg:not([class*='size-'])]:size-6",
        lg: "size-16 [&_svg:not([class*='size-'])]:size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type EmptyIconProps = React.ComponentProps<"div"> &
  VariantProps<typeof emptyIconVariants>;

const EmptyIcon = ({ className, variant, size, ...props }: EmptyIconProps) => {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      data-size={size}
      className={cn(emptyIconVariants({ variant, size }), className)}
      {...props}
    />
  );
};

/* ------------------------------ Empty Header ------------------------------ */

const EmptyHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Empty Title ------------------------------ */

const EmptyTitle = ({ className, ...props }: React.ComponentProps<"h2">) => {
  return (
    <h2
      data-slot="empty-title"
      className={cn(
        "text-lg font-medium tracking-tight text-primary-foreground",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Empty Description ------------------------------ */

const EmptyDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const EmptyComposed = Object.assign(Empty, {
  Header: EmptyHeader,
  Icon: EmptyIcon,
  Title: EmptyTitle,
  Description: EmptyDescription,
});

export {
  EmptyComposed as Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
};