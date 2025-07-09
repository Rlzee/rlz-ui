"use client";

import { ComponentProps } from "react";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Card ------------------------------ */

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-background-secondary text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Card Header ------------------------------ */

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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
      className={cn("text-lg font-semibold", className)}
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

const CardContent = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
};

/* ------------------------------ Card Footer ------------------------------ */

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const CardRoot = Card;

const CardComposed = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export {
  CardComposed as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
