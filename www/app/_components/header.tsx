"use client";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
  NavbarDesktop,
  NavbarMobile,
  NavbarProvider,
} from "@/src/ui/components/navbar";
import { ThemeToggle } from "@/src/ui/components/toggle-theme";
import { ButtonSearch } from "@/src/ui/components/custom/button-search";
import { Separator } from "@/src/ui/components/separator";
import { navLinks } from "./_data/data";
import { Github } from "@/src/ui/icons/social-icons";
import { Button } from "@/src/ui/components/button";

export function Header() {
  return (
    <NavbarProvider>
      <Navbar className="border-b border-border">
        <NavbarContent className="lg:px-8 px-4 h-16">
          <div className="flex items-center">
            <NavbarToggle className="hover:bg-transparent cursor-pointer" size="sm" />
            <span className="md:hidden flex font-raleway">Menu</span>
          </div>
          <NavbarDesktop>
            {navLinks.map((link, index) => (
              <NavbarItem key={index} type="link" href={link.href} label={link.label} />
            ))}
          </NavbarDesktop>
          <div className="flex items-center gap-2 ml-auto">
            <ButtonSearch placeholder="Search documentation..." className="invisible md:visible" />
            <Separator orientation="vertical" className="h-6 hidden md:inline-block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open("https://github.com/Rlzee/rlz-ui", "_blank")}
            >
              <Github className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" />
            <ThemeToggle size="sm" />
          </div>
        </NavbarContent>
        <NavbarMobile>
          {navLinks.map((link, index) => (
            <NavbarItem key={index} type="link" href={link.href} label={link.label} />
          ))}
        </NavbarMobile>
      </Navbar>
    </NavbarProvider>
  );
}
