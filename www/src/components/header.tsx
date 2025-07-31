"use client";

import { Navbar } from "@/src/ui/components/navbar";
import { ThemeToggle } from "@/src/ui/components/toggle-theme";
import { ButtonSearch } from "@/src/ui/components/custom/button/button-search";
import { Separator } from "@/src/ui/components/separator";
import { navLinks } from "@/src/data/data";
import { Github } from "@/src/ui/icons/social-icons";
import { Button } from "@/src/ui/components/button";
import { BorderFlash } from "@/src/ui/components/animated/border-flash";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <Navbar className="h-16">
      <Navbar.Group>
        <Navbar.Toggle />
        <Navbar.List>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Navbar.ItemLink
                href={link.href}
                key={link.href}
                className="text-sm"
                variant="primary"
                isActive={isActive}
              >
                {link.label}
              </Navbar.ItemLink>
            );
          })}
        </Navbar.List>
        <div className="flex items-center gap-2 ml-auto">
          <ButtonSearch
            placeholder="Search documentation..."
            className="invisible md:visible"
          />
          <Separator className="h-6 hidden md:inline-block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open("https://github.com/Rlzee/rlz-ui", "_blank")
            }
          >
            <Github className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" />
          <ThemeToggle size="sm" />
        </div>
      </Navbar.Group>
      <Navbar.Mobile>
        <Navbar.MobileGroup>
          <ButtonSearch
            placeholder="Search documentation..."
            className="w-full mb-2"
          />
          <Navbar.MobileList>
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Navbar.ItemLink
                  href={link.href}
                  key={link.href}
                  variant="primary"
                  isActive={isActive}
                >
                  {link.label}
                </Navbar.ItemLink>
              );
            })}
          </Navbar.MobileList>
        </Navbar.MobileGroup>
      </Navbar.Mobile>
      <BorderFlash Animation="right" border="bottom" />
    </Navbar>
  );
}
