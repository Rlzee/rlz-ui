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
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import { cva } from "class-variance-authority";

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
};

type NavbarButtonItem = {
  type: "button";
  sectionId: string;
  label: string;
};

type NavbarItemProps = (NavbarLinkItem | NavbarButtonItem) & {
  onClick?: () => void;
};

const NavbarItem = (props: NavbarItemProps) => {
  const Classes =
    "md:text-sm text-2xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer md:text-center text-left";

  const handleClick = () => {
    if (props.type === "button") {
      const section = document.getElementById(props.sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
    props.onClick?.();
  };

  if (props.type === "link") {
    return (
      <Link href={props.href} className={Classes} data-slot="navbar-link-item">
        {props.label}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={Classes}
      data-slot="navbar-button-item"
    >
      {props.label}
    </button>
  );
};

/* ----------------------------- Navbar Menu ------------------------------ */

const NavbarMenu = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navbar-menu"
      data-viewport={false}
      className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center"
    >
      <NavigationMenuPrimitive.List
        data-slot="navbar-menu-list"
        className="group flex flex-1 list-none items-center justify-center gap-1"
      >
        <NavigationMenuPrimitive.Item
          data-slot="navbar-menu-item"
          className={cn("relative", className)}
          {...props}
        />
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
};

/* ----------------------------- Navbar Menu Trigger ------------------------------ */

const navbarMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-secondary focus:bg-secondary disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-secondary data-[state=open]:focus:bg-secondary data-[state=open]:bg-secondary/80 outline-none transition-[color,box-shadow] focus-visible:outline-1"
);

const NavbarMenuTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) => {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navbarMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
};

/* ----------------------------- Navbar Menu Content ------------------------------ */

const NavbarMenuContent = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) => {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
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
  NavbarMenu,
  NavbarMenuTrigger,
  NavbarMenuContent,
};
