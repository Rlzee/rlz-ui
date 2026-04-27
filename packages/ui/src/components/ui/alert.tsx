import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@rlz/ui/lib/cn";

const alertVariants = cva(
  cn(
    "relative w-full rounded-lg border py-3 px-3 text-card-foreground",
    "grid items-start grid-cols-[0_1fr] has-[[data-slot=alert-action]]:pr-18",
    "[&>svg]:size-4 has-[>svg]:py-2.5 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-2"
  ),
  {
    variants: {
      variant: {
        default: "bg-card [&>svg]:text-muted-foreground",
        error:
          "border-destructive/50 bg-destructive/15 [&>svg]:text-destructive",
        info: "border-info/30 bg-info/8 [&>svg]:text-info",
        success: "border-success/30 bg-success/8 [&>svg]:text-success",
        warning: "border-warning/30 bg-warning/8 [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>): React.ReactElement {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"h3">): React.ReactElement {
  return (
    <h3
      data-slot="alert-title"
      className={cn("col-start-2 font-medium leading-none", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"p">): React.ReactElement {
  return (
    <p
      data-slot="alert-description"
      className={cn("col-start-2 ui-description", className)}
      {...props}
    />
  );
}

function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-1/2 -translate-y-1/2 right-3", className)}
      {...props}
    />
  );
}

const AlertExports = Object.assign(Alert, {
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
});

export { AlertExports as Alert, AlertTitle, AlertDescription, AlertAction };
