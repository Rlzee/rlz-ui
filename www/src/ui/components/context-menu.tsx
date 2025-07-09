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
import { Slot } from "@radix-ui/react-slot";

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

interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const ContextMenuTrigger = ({
  asChild = false,
  className,
  children,
  ...props
}: ContextMenuTriggerProps) => {
  const context = React.useContext(ContextMenuContext);
  if (!context)
    throw new Error("ContextMenuTrigger must be used within ContextMenu");

  const { setOpen, setPosition } = context;

  const Comp = asChild ? Slot : "div";

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  return (
    <Comp
      onContextMenu={handleContextMenu}
      className={cn(className)}
      data-slot="context-menu-trigger"
      {...props}
    >
      {children}
    </Comp>
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

const ContextMenuItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) => {
  return <DropdownMenuItem {...props} data-slot="context-menu-item" />;
};

/* ------------------------------ Context Menu Checkbox Item ------------------------------ */

const ContextMenuCheckboxItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) => {
  return (
    <DropdownMenuCheckboxItem
      {...props}
      data-slot="context-menu-checkbox-item"
    />
  );
};

/* ------------------------------ Context Menu Radio Item ------------------------------ */

const ContextMenuRadioItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) => {
  return (
    <DropdownMenuRadioItem {...props} data-slot="context-menu-radio-item" />
  );
};

/* ------------------------------ Context Menu Label ------------------------------ */

const ContextMenuLabel = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) => {
  return <DropdownMenuLabel {...props} data-slot="context-menu-label" />;
};

/* ------------------------------ Context Menu Separator ------------------------------ */

const ContextMenuSeparator = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) => {
  return (
    <DropdownMenuSeparator {...props} data-slot="context-menu-separator" />
  );
};

/* ------------------------------ Context Menu Shortcut ------------------------------ */

const ContextMenuShortcut = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) => {
  return <DropdownMenuShortcut {...props} data-slot="context-menu-shortcut" />;
};

/* ------------------------------ Context Menu Group ------------------------------ */

const ContextMenuGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) => {
  return <DropdownMenuGroup {...props} data-slot="context-menu-group" />;
};

/* ------------------------------ Context Menu Portal ------------------------------ */

const ContextMenuPortal = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) => {
  return <DropdownMenuPortal {...props} data-slot="context-menu-portal" />;
};

/* ------------------------------ Context Menu Submenu ------------------------------ */

const ContextMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuSub>) => {
  return <DropdownMenuSub {...props} data-slot="context-menu-sub" />;
};

/* ------------------------------ Context Menu Sub Content ------------------------------ */

const ContextMenuSubContent = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) => {
  return (
    <DropdownMenuSubContent {...props} data-slot="context-menu-sub-content" />
  );
};

/* ------------------------------ Context Menu Sub Trigger ------------------------------ */

const ContextMenuSubTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger>) => {
  return (
    <DropdownMenuSubTrigger {...props} data-slot="context-menu-sub-trigger" />
  );
};

/* ------------------------------ Context Menu Radio Group ------------------------------ */

const ContextMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) => {
  return (
    <DropdownMenuRadioGroup {...props} data-slot="context-menu-radio-group" />
  );
};

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
