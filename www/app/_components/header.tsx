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

export function Header() {
  return (
    <NavbarProvider>
      <Navbar className="border-b-2 border-border">
        <NavbarContent>
          <NavbarToggle />
          <NavbarDesktop>
            <NavbarItem type="link" href="/" label="Home" />
            <NavbarItem type="link" href="docs" label="Docs" />
            <NavbarItem type="link" href="" label="Blocks" />
            <NavbarItem type="link" href="" label="Templates" />
            <NavbarItem type="link" href="" label="Themes" />
            <NavbarItem type="link" href="" label="Community" />
          </NavbarDesktop>
          <div className="flex items-center gap-2 ml-auto">
            <InputSearch placeholder="Search documentation..." />
            <Separator orientation="vertical" className="h-6 hidden md:inline-block" />
            <ThemeToggle />
          </div>
        </NavbarContent>
        <NavbarMobile>
          <NavbarItem type="link" href="/" label="Home" />
          <NavbarItem type="link" href="docs" label="Docs" />
          <NavbarItem type="link" href="" label="Blocks" />
          <NavbarItem type="link" href="" label="Templates" />
          <NavbarItem type="link" href="" label="Themes" />
          <NavbarItem type="link" href="" label="Community" />
        </NavbarMobile>
      </Navbar>
    </NavbarProvider>
  );
}
