"use client";

import {
  createContext,
  useContext,
  useState,
  ComponentProps,
  ReactNode,
} from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useIsMobile } from "@/src/ui/hooks/use-mobile";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import { Menu, X } from "lucide-react";

/* --------------------------- Context Navbar --------------------------- */

type NavbarContextProps = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
};

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};

/* --------------------------- Navbar Provider --------------------------- */

const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <NavbarContext.Provider value={{ openMobile, setOpenMobile }}>
      {children}
    </NavbarContext.Provider>
  );
};

/* --------------------------- Root Navbar --------------------------- */

const Navbar = ({ className, children, ...props }: ComponentProps<"nav">) => {
  return (
    <NavbarProvider>
      <nav
        data-slot="navbar"
        className={cn(
          "z-50 sticky top-0 w-full bg-background/60 backdrop-blur-lg h-14",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    </NavbarProvider>
  );
};

/* --------------------------- Navbar Group --------------------------- */

const NavbarGroup = ({
  children,
  className,
  ...props
}: ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="navbar-group"
      className={cn(
        "flex items-center justify-between h-full w-full px-4",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
};

/* --------------------------- Navbar List --------------------------- */

const NavbarList = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => {
  return (
    <li
      data-slot="navbar-list"
      className={cn("items-center gap-1 hidden md:flex", className)}
      {...props}
    >
      {children}
    </li>
  );
};

/* --------------------------- Navbar Item --------------------------- */

const navbarItemStyle = cva("text-muted-foreground px-2", {
  variants: {
    variant: {
      default:
        "hover:bg-secondary hover:text-foreground py-1 rounded-md data-[active=true]:bg-muted data-[active=true]:text-foreground",
      primary: "hover:text-foreground data-[active=true]:text-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface NavbarItemProps
  extends ComponentProps<"button">,
    VariantProps<typeof navbarItemStyle> {
  asChild?: boolean;
  isActive?: boolean;
}

const NavbarItemButton = ({
  children,
  className,
  asChild = false,
  variant,
  isActive = false,
  ...props
}: NavbarItemProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="navbar-item"
      data-active={isActive}
      className={cn(
        "flex items-center",
        navbarItemStyle({ variant }),
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

/* --------------------------- Navbar Item Link --------------------------- */

interface NavbarItemLinkProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof navbarItemStyle> {
  isActive?: boolean;
}

const NavbarItemLink = ({
  children,
  className,
  variant,
  isActive = false,
  ...props
}: NavbarItemLinkProps) => {
  return (
    <Link
      data-slot="navbar-item"
      data-active={isActive}
      className={cn(
        "flex items-center",
        navbarItemStyle({ variant }),
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

/* --------------------------- Navbar Toggle --------------------------- */

const NavbarToggle = () => {
  const { openMobile, setOpenMobile } = useNavbar();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <button
      className="md:hidden p-2"
      onClick={() => setOpenMobile(!openMobile)}
      aria-label="Toggle navigation"
    >
      {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle menu</span>
    </button>
  );
};

/* --------------------------- Navbar Mobile --------------------------- */

const NavbarMobile = ({ children, className }: ComponentProps<"div">) => {
  const { openMobile, setOpenMobile } = useNavbar();

  return (
    <div
      data-slot="navbar-mobile"
      className={cn(
        "md:hiddenr h-0 overflow-hidden absolute top-14 left-0 right-0 bg-background/95 transition-all duration-300",
        openMobile && "h-[calc(100vh-3.5rem)]",
        className
      )}
    >
      <div className="p-4">{children}</div>
    </div>
  );
};

/* --------------------------- Navbar Mobile Group --------------------------- */

const NavbarMobileGroup = ({
  children,
  className,
  ...props
}: ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="navbar-mobile-group"
      className={cn("flex flex-col items-start p-4 h-full w-full", className)}
      {...props}
    >
      {children}
    </ul>
  );
};

/* --------------------------- Navbar Mobile List --------------------------- */

const NavbarMobileList = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => {
  return (
    <li
      data-slot="navbar-mobile-list"
      className={cn("flex flex-col text-2xl gap-2 text-left", className)}
      {...props}
    >
      {children}
    </li>
  );
};

/* --------------------------- Navbar Menu Label --------------------------- */

const NavbarMobileLabel = ({
  children,
  className,
  ...props
}: ComponentProps<"span">) => {
  return (
    <span
      data-slot="navbar-menu-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    >
      {children}
    </span>
  );
};

/* --------------------------- Exports --------------------------- */

const NavbarComposed = Object.assign(Navbar, {
  Group: NavbarGroup,
  List: NavbarList,
  ItemButton: NavbarItemButton,
  ItemLink: NavbarItemLink,
  Provider: NavbarProvider,
  Toggle: NavbarToggle,
  Mobile: NavbarMobile,
  MobileGroup: NavbarMobileGroup,
  MobileList: NavbarMobileList,
  MobileLabel: NavbarMobileLabel,
});

export {
  NavbarComposed as Navbar,
  NavbarGroup,
  NavbarList,
  NavbarItemButton,
  NavbarItemLink,
  useNavbar,
  NavbarProvider,
  NavbarToggle,
  NavbarMobile,
  NavbarMobileGroup,
  NavbarMobileList,
  NavbarMobileLabel,
};
