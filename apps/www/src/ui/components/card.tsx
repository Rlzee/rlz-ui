import { ComponentProps } from "react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Card ------------------------------ */

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-background-secondary flex flex-col gap-6 rounded-lg border border-border py-6",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Card Header ------------------------------ */

const CardHeader = ({ className, ...props }: ComponentProps<"header">) => {
  return (
    <header
      data-slot="card-header"
      className={cn(
        "px-6 flex flex-col gap-0.5",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Card Title ------------------------------ */

const CardTitle = ({ className, ...props }: ComponentProps<"h3">) => {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  );
};

/* ------------------------------ Card Description ------------------------------ */

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

/* ------------------------------ Card Content ------------------------------ */

const CardBody = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <main
      data-slot="card-body"
      className={cn("px-6 flex-1", className)}
      {...props}
    />
  );
};

/* ------------------------------ Card Footer ------------------------------ */

const CardFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const CardComposed = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

export {
  CardComposed as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
};
