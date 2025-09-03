import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Breadcrumb ------------------------------ */

const BreadcrumbRoot = ({ ...props }: ComponentProps<"nav">) => {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
};

/* ------------------------------ Breadcrumb Group ------------------------------ */

const BreadcrumbGroup = ({ ...props }: ComponentProps<"ol">) => {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex space-x-2 text-sm", props.className)}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb List ------------------------------ */

const BreadcrumbList = ({ className, ...props }: ComponentProps<"li">) => {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Item ------------------------------ */

const BreadcrumbItem = ({
  className,
  isActive = false,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean }) => {
  const Comp = props.asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-item"
      className={cn(
        "hover:text-foreground transition-colors",
        isActive
          ? "text-primary hover:text-primary cursor-default"
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Breadcrumb Separator ------------------------------ */

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="breadcrumb-separator"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children || "/"}
    </span>
  );
};

/* --------------------------- Breadcrumb --------------------------- */

const Breadcrumb = ({ children }: { children: React.ReactNode }) => {
  return (
    <BreadcrumbRoot>
      <BreadcrumbGroup>
        <BreadcrumbList>{children}</BreadcrumbList>
      </BreadcrumbGroup>
    </BreadcrumbRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const BreadcrumbComposed = Object.assign(Breadcrumb, {
  Root: BreadcrumbRoot,
  Group: BreadcrumbGroup,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
});

export {
  BreadcrumbComposed as Breadcrumb,
  BreadcrumbRoot,
  BreadcrumbGroup,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
};
