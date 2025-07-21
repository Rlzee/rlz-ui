/**
 * Adapted from: https://ui.shadcn.com/docs/components/breadcrumb
 *
 * Original work by shadcn (https://github.com/shadcn/ui)
 * Licensed under the MIT License
 *
 * Copyright (c) 2023 shadcn
 */

import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Breadcrumb ------------------------------ */

const Breadcrumb = ({ ...props }: ComponentProps<"nav">) => {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
};

/* ------------------------------ Breadcrumb List ------------------------------ */

const BreadcrumbList = ({ className, ...props }: ComponentProps<"ol">) => {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Item ------------------------------ */

const BreadcrumbItem = ({ className, ...props }: ComponentProps<"li">) => {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Link ------------------------------ */

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Page ------------------------------ */

const BreadcrumbPage = ({ className, ...props }: ComponentProps<"span">) => {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Separator ------------------------------ */

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
};

/* ------------------------------ Breadcrumb Ellipsis ------------------------------ */

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
};

/* ------------------------------ Exports ------------------------------ */

const BreadcrumbComposed = Object.assign(Breadcrumb, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});

export {
  BreadcrumbComposed as Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
