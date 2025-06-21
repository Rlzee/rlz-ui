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
import { InputSearch } from "@/src/ui/components/input-search";
import { Separator } from "@/src/ui/components/separator";
import { navLinks } from "./_data/data";

export function Header() {
  return (
    <NavbarProvider>
      <Navbar className="border-b-2 border-border">
        <NavbarContent>
          <NavbarToggle />
          <NavbarDesktop>
            {navLinks.map((link, index) => (
              <NavbarItem key={index} type="link" href={link.href} label={link.label} />
            ))}
          </NavbarDesktop>
          <div className="flex items-center gap-2 ml-auto">
            <InputSearch placeholder="Search documentation..." />
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
