"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/ui/components/basic/button";
import { cn } from "@/src/lib/utils";

/* --------------------------- Context & Provider --------------------------- */

type NavbarContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

function NavbarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close]);

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
}

function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}

/* ------------------------------ Root Navbar ------------------------------ */

function Navbar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav className={cn("z-50 sticky top-0 w-full bg-background/60 backdrop-blur-lg", className)}>
      {children}
    </nav>
  );
}

function NavbarContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col">
      <div className={cn("flex items-center justify-between h-14 px-4", className)}>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- Navbar Items ------------------------------ */

type NavbarItemProps =
  | { type: "link"; href: string; label: string }
  | { type: "button"; sectionId: string; label: string };

function NavbarItem(props: NavbarItemProps & { onClick?: () => void }) {
  const { type, label } = props;

  const Classes = "text-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer text-center";

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  if (type === "link") {
    return (
      <Link
        href={props.href}
        className= {Classes}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        scrollToSection(props.sectionId);
        props.onClick?.();
      }}
      className={Classes}
    >
      {label}
    </button>
  );
}

/* -------------------------- Responsive Sections -------------------------- */

function NavbarToggle() {
  const { isOpen, toggle } = useNavbar();

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="md:hidden">
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

function NavbarDesktop({ children }: { children: ReactNode }) {
  return <div className="hidden md:flex items-center space-x-6">{children}</div>;
}

function NavbarMobile({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useNavbar();
  if (!isOpen) return null;

  return (
    <div className="md:hidden pt-4 pb-4 flex flex-col border-t border-border space-y-4 px-4">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const element = child as React.ReactElement<{ onClick?: () => void }>;
        const originalOnClick = element.props.onClick;

        return React.cloneElement(element, {
          onClick: () => {
            originalOnClick?.();
            close();
          },
        });
      })}
    </div>
  );
}

/* ------------------------------ Exports ------------------------------ */

export {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarDesktop,
  NavbarMobile,
  NavbarToggle,
  NavbarProvider,
  useNavbar,
};
