"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactElement,
  ReactNode,
} from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/ui/components/button"
import { cn } from "@/src/lib/utils"

/* --------------------------- Context & Provider --------------------------- */

type NavbarContextType = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

const NavbarProvider = ({ children }:  { children: ReactNode } ) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ isOpen, toggle, close }), [isOpen, toggle, close])

  return <NavbarContext.Provider value={value} data-slot="navbar-provider">{children}</NavbarContext.Provider>
}

const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext)
  if (!context) throw new Error("useNavbar must be used within a NavbarProvider")
  return context
}

/* ------------------------------ Root Navbar ------------------------------ */

const Navbar = ({ children, className, ...props }: React.ComponentProps<"nav"> ) => (
  <nav className={cn("z-50 sticky top-0 w-full bg-background/60 backdrop-blur-lg", className)} {...props} data-slot="navbar">
    {children}
  </nav>
)

/* ----------------------------- Navbar Content ----------------------------- */

const NavbarContent = ({
  children,
  className,
}: React.ComponentProps<"div"> ) => (
  <div className="flex flex-col" data-slot="navbar-content">
    <div className={cn("flex items-center justify-between h-14 px-4", className)}>{children}</div>
  </div>
)

/* ----------------------------- Navbar Items ------------------------------ */

type NavbarLinkItem = {
  type: "link"
  href: string
  label: string
}

type NavbarButtonItem = {
  type: "button"
  sectionId: string
  label: string
}

type NavbarItemProps = (NavbarLinkItem | NavbarButtonItem) & {
  onClick?: () => void
}

const NavbarItem = (props: NavbarItemProps) => {
  const Classes =
    "text-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer text-center"

  const handleClick = () => {
    if (props.type === "button") {
      const section = document.getElementById(props.sectionId)
      if (section) section.scrollIntoView({ behavior: "smooth" })
    }
    props.onClick?.()
  }

  if (props.type === "link") {
    return (
      <Link href={props.href} className={Classes} data-slot="navbar-link-item">
        {props.label}
      </Link>
    )
  }

  return (
    <button onClick={handleClick} className={Classes} data-slot="navbar-button-item">
      {props.label}
    </button>
  )
}

/* -------------------------- Responsive Sections -------------------------- */

const NavbarToggle = ({ className }: React.ComponentProps<"button">) => {
  const { isOpen, toggle } = useNavbar()

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className={cn("md:hidden", className)} data-slot="navbar-toggle">
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  )
}

const NavbarDesktop = ({ children }: React.ComponentProps<"div"> ) => (
  <div className="hidden md:flex items-center space-x-6" data-slot="navbar-desktop">{children}</div>
)

const NavbarMobile = ({ children }: React.ComponentProps<"div"> ) => {
  const { isOpen, close } = useNavbar()
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      setHeight(containerRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div
      data-slot="navbar-mobile"
      style={{ maxHeight: isOpen ? `${height}px` : "0px", overflow: "hidden" }}
      className={cn(
        "transition-all duration-300 ease-in-out md:hidden border-border",
        isOpen && "border-t border-border px-4 pt-4 pb-4"
      )}
    >
      <div ref={containerRef} className="flex flex-col space-y-4">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child

          const element = child as ReactElement<{ onClick?: () => void }>
          const originalOnClick = element.props.onClick

          return React.cloneElement(element, {
            onClick: () => {
              originalOnClick?.()
              close()
            },
          })
        })}
      </div>
    </div>
  )
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
}
