"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactElement,
  ReactNode,
  ComponentProps,
} from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/ui/components/button";
import { cn } from "@/src/lib/utils";
import { scrollToSection } from "@/src/ui/utils/utils";

/* --------------------------- Context & Provider --------------------------- */

type NavbarContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, toggle, close }),
    [isOpen, toggle, close]
  );

  return (
    <NavbarContext.Provider value={value} data-slot="navbar-provider">
      {children}
    </NavbarContext.Provider>
  );
};

const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (!context)
    throw new Error("useNavbar must be used within a NavbarProvider");
  return context;
};

/* ------------------------------ Root Navbar ------------------------------ */

const Navbar = ({ children, className, ...props }: ComponentProps<"nav">) => (
  <nav
    className={cn(
      "z-50 sticky top-0 w-full bg-background/60 backdrop-blur-lg",
      className
    )}
    {...props}
    data-slot="navbar"
  >
    {children}
  </nav>
);

/* ----------------------------- Navbar Content ----------------------------- */

const NavbarContent = ({ children, className }: ComponentProps<"div">) => (
  <div className="flex flex-col" data-slot="navbar-content">
    <div
      className={cn("flex items-center justify-between h-14 px-4", className)}
    >
      {children}
    </div>
  </div>
);

/* ----------------------------- Navbar Items ------------------------------ */

type NavbarLinkItem = {
  type: "link";
  href: string;
  label: string;
  className?: string;
};

type NavbarButtonItem = {
  type: "button";
  sectionId: string;
  label: string;
  className?: string;
};

type NavbarItemProps = (NavbarLinkItem | NavbarButtonItem) & {
  onClick?: () => void;
};

const NavbarItem = (props: NavbarItemProps) => {
  const Classes =
    "md:text-sm text-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer md:text-center text-left px-4 md:px-0";

  const handleClick = () => {
    if (props.type === "button") {
      scrollToSection(props.sectionId);
    }
    props.onClick?.();
  };

  if (props.type === "link") {
    return (
      <Link href={props.href} className={cn(Classes, props.className)} data-slot="navbar-link-item">
        {props.label}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(Classes, props.className)}
      data-type="button"
      data-slot="navbar-button-item"
    >
      {props.label}
    </button>
  );
};

/* -------------------------- Responsive Sections -------------------------- */

const NavbarToggle = ({ className }: ComponentProps<typeof Button>) => {
  const { isOpen, toggle } = useNavbar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn("md:hidden", className)}
      data-slot="navbar-toggle"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

const NavbarDesktop = ({ children }: ComponentProps<"div">) => (
  <div
    className="hidden md:flex items-center space-x-6"
    data-slot="navbar-desktop"
  >
    {children}
  </div>
);

const NavbarMobile = ({ children }: ComponentProps<"div">) => {
  const { isOpen, close } = useNavbar();

  return (
    <div
      data-slot="navbar-mobile"
      className={cn(
        "md:hidden border-border h-0 overflow-hidden absolute top-14 left-0 right-0 bg-background/95 transition-all duration-300",
        isOpen && "border-t border-border px-4 pt-4 pb-4 h-[calc(100vh-3.5rem)]"
      )}
    >
      <div className="flex flex-col space-y-4">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          const element = child as ReactElement<{ onClick?: () => void }>;
          const originalOnClick = element.props.onClick;

          return React.cloneElement(element, {
            onClick: () => {
              originalOnClick?.();
              close();
            },
          });
        })}
      </div>
    </div>
  );
};

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
