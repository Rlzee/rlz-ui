"use client";

import { ComponentProps, ReactNode } from "react";
import { cn } from "@ui/lib/utils";
import { Button, type buttonVariantTypes } from "@ui/components/button";
import { Popover } from "@ui/components/popover";

/* --------------------------- Header --------------------------- */

type HeaderProps = ComponentProps<"header"> & {
  blur?: boolean;
  classNameContainer?: string;
};

const Header = ({
  classNameContainer,
  className,
  children,
  blur = false,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        blur ? "backdrop-blur-lg bg-background/60" : "bg-background"
      )}
      {...props}
    >
      <div
        className={cn(
          "container-wrapper 3xl:fixed:px-0 px-6",
          classNameContainer
        )}
      >
        <div
          className={cn(
            "3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4",
            className
          )}
        >
          {children}
        </div>
      </div>
    </header>
  );
};

/* --------------------------- Header Nav --------------------------- */

const HeaderNav = ({
  children,
  className,
  ...props
}: ComponentProps<"nav">) => {
  return (
    <nav
      className={cn("items-center gap-0.5 hidden lg:flex", className)}
      {...props}
    >
      {children}
    </nav>
  );
};

/* --------------------------- Header Nav Link --------------------------- */

type HeaderNavLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  variant?: buttonVariantTypes;
};

const HeaderNavLink = ({
  href,
  children,
  isActive,
  variant = "link",
}: HeaderNavLinkProps) => {
  return (
    <Button
      variant={variant}
      asChild
      size="sm"
      className={variant === "link" ? "px-2" : ""}
    >
      <a href={href} className={cn(isActive && "text-primary")}>
        {children}
      </a>
    </Button>
  );
};

/* --------------------------- Header Mobile --------------------------- */

const HeaderMobile = ({
  children,
  ...props
}: ComponentProps<typeof Popover>) => {
  return <Popover {...props}>{children}</Popover>;
};

/* --------------------------- Header Mobile Trigger --------------------------- */

const HeaderMobileTrigger = ({
  children,
}: ComponentProps<typeof Popover.Trigger>) => {
  return (
    <Popover.Trigger asChild className="flex lg:hidden">
      {children}
    </Popover.Trigger>
  );
};

/* --------------------------- Header Mobile Content --------------------------- */

const HeaderMobileContent = ({
  children,
  className,
  blur = false,
}: ComponentProps<typeof Popover.Content> & { blur?: boolean }) => {
  return (
    <Popover.Content
      className={cn(
        "flex lg:hidden",
        blur ? "bg-background/90 backdrop-blur" : "bg-background",
        "no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none duration-100",
        className
      )}
      align="start"
      side="bottom"
      alignOffset={-16}
      sideOffset={0}
    >
      {children}
    </Popover.Content>
  );
};

/* --------------------------- Header Mobile Nav --------------------------- */

const HeaderMobileNav = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-4 overflow-auto px-6 py-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

/* --------------------------- Header Mobile Label --------------------------- */

const HeaderMobileLabel = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn("text-muted-foreground text-sm font-medium", className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

/* --------------------------- Header Mobile Group --------------------------- */

const HeaderMobileGroup = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
};

/* --------------------------- Header Mobile Link --------------------------- */

interface HeaderMobileLinkProps {
  href: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

const HeaderMobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: HeaderMobileLinkProps) => {

  return (
    <a
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn("text-2xl font-medium", className)}
      {...props}
    >
      {children}
    </a>
  );
};

/* --------------------------- Exports --------------------------- */

const HeaderComposed = Object.assign(Header, {
  Nav: HeaderNav,
  NavLink: HeaderNavLink,
  Mobile: HeaderMobile,
  MobileTrigger: HeaderMobileTrigger,
  MobileContent: HeaderMobileContent,
  MobileLabel: HeaderMobileLabel,
  MobileGroup: HeaderMobileGroup,
  MobileNav: HeaderMobileNav,
  MobileLink: HeaderMobileLink,
});

export {
  HeaderComposed as Header,
  HeaderNav,
  HeaderNavLink,
  HeaderMobile,
  HeaderMobileTrigger,
  HeaderMobileContent,
  HeaderMobileLabel,
  HeaderMobileGroup,
  HeaderMobileNav,
  HeaderMobileLink,
};
