"use client";

import type * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@rlz/ui/lib/cn";

function BreadcrumbRoot(props: React.ComponentProps<"nav">) {
  return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-group"
      className={cn(
        "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-list"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  isActive,
  render,
  className,
  ...props
}: useRender.ComponentProps<"a"> & {
  isActive?: boolean;
}) {
  const defaultProps = {
    "data-slot": "breadcrumb-link",
    "data-active": isActive,
    "aria-current": isActive ? "page" : undefined,
    className: cn(
      "text-muted-foreground hover:text-primary transition-colors data-[active=true]:text-primary",
      className
    ),
  };

  return useRender({
    defaultTagName: "a",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      aria-hidden={true}
      role="presentation"
      className={cn("text-muted-foreground [&>svg]:size-4", className)}
      {...props}
    >
      {children || "/"}
    </li>
  );
}

const BreadcrumbExports = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Separator: BreadcrumbSeparator,
});

export {
  BreadcrumbExports as Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};
