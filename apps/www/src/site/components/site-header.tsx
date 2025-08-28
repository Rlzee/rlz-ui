"use client";

import { Header } from "@ui/components/header";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@ui/components/toggle-theme";
import { Separator } from "@ui/components/separator";
import { Button } from "@ui/components/button";
import { Github } from "@ui/icons/social-icons";
import { ButtonSearch } from "./button-search";
import { cn } from "@ui/lib/utils";
import { DocsConfig } from "@site/config/docs";

const SiteHeader = ({ config }: { config: DocsConfig }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { mainNav } = config;

  return (
    <Header blur={!open} classNameContainer="border-b border-border">
      <Header.Nav>
        {mainNav.map((item) => (
          <Header.NavLink
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.title}
          </Header.NavLink>
        ))}
      </Header.Nav>
      <Header.Mobile open={open} onOpenChange={setOpen}>
        <Header.MobileTrigger>
          <Button
            variant="ghost"
            className="extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent"
          >
            <div className="relative flex h-8 w-4 items-center justify-center">
              <div className="relative size-4">
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] -rotate-45" : "top-1"
                  )}
                />
                <span
                  className={cn(
                    "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                    open ? "top-[0.4rem] rotate-45" : "top-2.5"
                  )}
                />
              </div>
              <span className="sr-only">Toggle Menu</span>
            </div>
            <span className="flex h-8 items-center text-lg leading-none font-medium">
              Menu
            </span>
          </Button>
        </Header.MobileTrigger>
        <Header.MobileContent blur>
          <Header.MobileNav>
            <Header.MobileLabel>Menu</Header.MobileLabel>
            <Header.MobileGroup>
              {mainNav.map((item) => (
                <Header.MobileLink
                  key={item.href}
                  href={item.href}
                  onOpenChange={setOpen}
                  className={pathname === item.href ? "text-primary" : ""}
                >
                  {item.title}
                </Header.MobileLink>
              ))}
            </Header.MobileGroup>
          </Header.MobileNav>
        </Header.MobileContent>
      </Header.Mobile>
      <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
        <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
          <ButtonSearch placeholder="Search documentation..." />
        </div>
        <Separator orientation="vertical" className="hidden md:block" />
        <Button asChild variant="ghost" size="sm">
          <a
            href="https://github.com/Rlzee/rlz-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </Button>
        <Separator orientation="vertical" />
        <ThemeToggle size="sm" />
      </div>
    </Header>
  );
};

export default SiteHeader;
