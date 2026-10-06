"use client";

import type * as React from "react";
import {
  BorderFlash,
  BorderFlashBox,
  BorderFlashBoxContent,
} from "@rlz/ui/components/animations/border-flash";
import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { CommandInput } from "./command-input";
import { DialogTrigger } from "@rlz/ui/components/ui/dialog";
import { Separator } from "@rlz/ui/components/ui/separator";
import { ModeSwitcher } from "./mode-switcher";
import GithubIcon from "./icons/Github";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@rlz/ui/lib/cn";
import { Badge } from "@rlz/ui/components/ui/badge";
import { MobileNav } from "./mobile-nav";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { dialogHandle } from "./project-dialog";

export function SiteHeader({ container }: { container?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-45"
      >
        <BorderFlash
          border="left"
          animation="top"
          className="absolute inset-y-0 -left-3 h-full"
          dashed
        />
        <BorderFlash
          border="right"
          animation="bottom"
          className="absolute inset-y-0 -right-3 h-full"
          dashed
        />
      </div>

      <div
        aria-hidden="true"
        className="container pointer-events-none fixed inset-0 z-45"
      >
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -left-[11.5px] -ml-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
        <BorderFlashBox className="absolute top-[calc(var(--header-height)-4.5px)] -right-[11.5px] -mr-1 size-2 rounded-[2px] bg-background shadow-xs/5 p-0">
          <BorderFlashBoxContent className="p-0" />
        </BorderFlashBox>
      </div>

      <header className="sticky top-0 z-40 w-full bg-sidebar-background/70 backdrop-blur-2xl">
        <div
          className={cn(
            "relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6",
            container && "container"
          )}
        >
          {/* left side nav & Mobile */}
          <MobileNav
            items={siteConfig.navItems}
            tree={source.pageTree}
            className="lg:hidden"
          />

          <nav className="items-center gap-0.5 hidden lg:flex">
            <Badge variant="info">Beta v1.0</Badge>
            {siteConfig.navItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                isActive={
                  pathname === item.href ||
                  (pathname.startsWith(item.href + "/") &&
                    item.href !== "/docs")
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
              <GithubIcon />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <ModeSwitcher />
            <Separator orientation="vertical" className="h-5" />
            <DialogTrigger
              handle={dialogHandle}
              render={
                <Button
                  aria-label="Open new project"
                  size="sm"
                  className="ml-1"
                />
              }
            >
              <Plus />
              New
            </DialogTrigger>
          </div>
        </div>
        <BorderFlash
          border="bottom"
          animation="right"
          className="absolute inset-x-0 bottom-0"
        />
      </header>
    </>
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
      render={<Link href={href} className={cn(isActive && "text-primary")} />}
    >
      {children}
    </Button>
  );
}
