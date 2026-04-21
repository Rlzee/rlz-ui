"use client";

import type * as React from "react";
import { BorderFlash } from "@rlz/ui/components/animations/border-flash";
import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { CommandInput } from "./command-input";
import { Separator } from "@rlz/ui/components/ui/separator";
import { ModeSwitcher } from "./mode-switcher";
import GithubIcon from "./icons/Github";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@rlz/ui/lib/cn";
import { Badge } from "@rlz/ui/components/ui/badge";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar-background backdrop-blur-lg">
      <div className="relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6 container">
        {/* left side nav */}
        <nav className="items-center gap-0.5 hidden lg:flex">
          <Badge variant="info">Beta v1.0</Badge>
          {siteConfig.navItems.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              isActive={
                pathname === item.href ||
                (pathname.startsWith(item.href + "/") && item.href !== "/docs")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* right side */}
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <CommandInput className="mr-1" />
          <Separator orientation="vertical" className="h-5" />
          <Button variant="ghost" size="icon-sm" render={<Link href="" />}>
            <GithubIcon className="size-4" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <ModeSwitcher />
          <Separator orientation="vertical" className="h-5" />
          <Button size="sm" className="ml-1">
            <Plus />
            New
          </Button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <BorderFlash
          border="bottom"
          animation="left"
          className="border-sidebar-border"
        />
      </div>
    </header>
  );
}

function NavLink({
  href,
  isActive,
  children,
  variant = "link",
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={
        variant === "link"
          ? "px-2 hover:no-underline text-muted-foreground"
          : ""
      }
      render={<a href={href} className={cn(isActive && "text-primary")} />}
    >
      {children}
    </Button>
  );
}
