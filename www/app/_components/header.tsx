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

export function Header() {
  return (
    <NavbarProvider>
      <Navbar className="border-b-2 border-border">
        <NavbarContent>
          <NavbarToggle />
          <NavbarDesktop>
            <NavbarItem type="link" href="" label="Docs" />
            <NavbarItem type="link" href="" label="Blocks" />
            <NavbarItem type="link" href="" label="Templates" />
            <NavbarItem type="link" href="" label="Themes" />
            <NavbarItem type="link" href="" label="Community" />
          </NavbarDesktop>
          <ThemeToggle />
        </NavbarContent>
        <NavbarMobile>
          <NavbarItem type="link" href="" label="Docs" />
          <NavbarItem type="link" href="" label="Blocks" />
          <NavbarItem type="link" href="" label="Templates" />
          <NavbarItem type="link" href="" label="Themes" />
          <NavbarItem type="link" href="" label="Community" />
        </NavbarMobile>
      </Navbar>
    </NavbarProvider>
  );
}
