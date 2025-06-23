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
import { ButtonSearch } from "@/src/ui/components/button-search";
import { Separator } from "@/src/ui/components/separator";
import { navLinks } from "./_data/data";

export function Header() {
  return (
    <NavbarProvider>
      <Navbar className="border-b border-border">
        <NavbarContent className="lg:px-8 px-2">
          <div className="flex items-center">
            <NavbarToggle className="hover:bg-background cursor-pointer"/>
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
            <ThemeToggle />
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
