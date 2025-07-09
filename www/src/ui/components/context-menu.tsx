"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Context Menu Context ------------------------------ */

const ContextMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
} | null>(null);

/* ------------------------------ Root Context Menu ------------------------------ */

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, position, setPosition }}
      data-slot="context-menu"
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        {children}
      </DropdownMenu>
    </ContextMenuContext.Provider>
  );
};

/* ------------------------------ Context Menu Trigger ------------------------------ */

const ContextMenuTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const context = React.useContext(ContextMenuContext);
  if (!context)
    throw new Error("ContextMenuTrigger must be used within ContextMenu");

  const { setOpen, setPosition } = context;

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={cn(className)}
      data-slot="context-menu-trigger"
    >
      {children}
    </div>
  );
};

/* ------------------------------ Context Menu Content ------------------------------ */

const ContextMenuContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) => {
  const context = React.useContext(ContextMenuContext);
  if (!context)
    throw new Error("ContextMenuContent must be used within ContextMenu");

  const { position } = context;

  return (
    <DropdownMenuContent
      data-slot="context-menu-content"
      {...props}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "none",
        ...props.style,
      }}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md",
        className
      )}
    />
  );
};

/* ------------------------------ Context Menu Item ------------------------------ */

const ContextMenuItem = DropdownMenuItem;

/* ------------------------------ Context Menu Checkbox Item ------------------------------ */

const ContextMenuCheckboxItem = DropdownMenuCheckboxItem;

/* ------------------------------ Context Menu Radio Item ------------------------------ */

const ContextMenuRadioItem = DropdownMenuRadioItem;

/* ------------------------------ Context Menu Label ------------------------------ */

const ContextMenuLabel = DropdownMenuLabel;

/* ------------------------------ Context Menu Separator ------------------------------ */

const ContextMenuSeparator = DropdownMenuSeparator;

/* ------------------------------ Context Menu Shortcut ------------------------------ */

const ContextMenuShortcut = DropdownMenuShortcut;

/* ------------------------------ Context Menu Group ------------------------------ */

const ContextMenuGroup = DropdownMenuGroup;

/* ------------------------------ Context Menu Portal ------------------------------ */

const ContextMenuPortal = DropdownMenuPortal;

/* ------------------------------ Context Menu Submenu ------------------------------ */

const ContextMenuSub = DropdownMenuSub;

/* ------------------------------ Context Menu Sub Content ------------------------------ */

const ContextMenuSubContent = DropdownMenuSubContent;

/* ------------------------------ Context Menu Sub Trigger ------------------------------ */

const ContextMenuSubTrigger = DropdownMenuSubTrigger;

/* ------------------------------ Context Menu Radio Group ------------------------------ */

const ContextMenuRadioGroup = DropdownMenuRadioGroup;

/* ------------------------------ Exports ------------------------------ */

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
