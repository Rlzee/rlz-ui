"use client";

import * as React from "react";
import { DropdownMenu } from "./dropdown-menu";
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
}: React.ComponentProps<typeof DropdownMenu.Content>) => {
  const context = React.useContext(ContextMenuContext);
  if (!context)
    throw new Error("ContextMenuContent must be used within ContextMenu");

  const { position } = context;

  return (
    <DropdownMenu.Content
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
}: React.ComponentProps<typeof DropdownMenu.Item>) => {
  return <DropdownMenu.Item {...props} data-slot="context-menu-item" />;
};

/* ------------------------------ Context Menu Checkbox Item ------------------------------ */

const ContextMenuCheckboxItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.CheckboxItem>) => {
  return (
    <DropdownMenu.CheckboxItem
      {...props}
      data-slot="context-menu-checkbox-item"
    />
  );
};

/* ------------------------------ Context Menu Radio Item ------------------------------ */

const ContextMenuRadioItem = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.RadioItem>) => {
  return (
    <DropdownMenu.RadioItem {...props} data-slot="context-menu-radio-item" />
  );
};

/* ------------------------------ Context Menu Label ------------------------------ */

const ContextMenuLabel = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Label>) => {
  return <DropdownMenu.Label {...props} data-slot="context-menu-label" />;
};

/* ------------------------------ Context Menu Separator ------------------------------ */

const ContextMenuSeparator = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Separator>) => {
  return (
    <DropdownMenu.Separator {...props} data-slot="context-menu-separator" />
  );
};

/* ------------------------------ Context Menu Shortcut ------------------------------ */

const ContextMenuShortcut = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Shortcut>) => {
  return <DropdownMenu.Shortcut {...props} data-slot="context-menu-shortcut" />;
};

/* ------------------------------ Context Menu Group ------------------------------ */

const ContextMenuGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Group>) => {
  return <DropdownMenu.Group {...props} data-slot="context-menu-group" />;
};

/* ------------------------------ Context Menu Portal ------------------------------ */

const ContextMenuPortal = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Portal>) => {
  return <DropdownMenu.Portal {...props} data-slot="context-menu-portal" />;
};

/* ------------------------------ Context Menu Submenu ------------------------------ */

const ContextMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.Sub>) => {
  return <DropdownMenu.Sub {...props} data-slot="context-menu-sub" />;
};

/* ------------------------------ Context Menu Sub Content ------------------------------ */

const ContextMenuSubContent = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubContent>) => {
  return (
    <DropdownMenu.SubContent {...props} data-slot="context-menu-sub-content" />
  );
};

/* ------------------------------ Context Menu Sub Trigger ------------------------------ */

const ContextMenuSubTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.SubTrigger>) => {
  return (
    <DropdownMenu.SubTrigger {...props} data-slot="context-menu-sub-trigger" />
  );
};

/* ------------------------------ Context Menu Radio Group ------------------------------ */

const ContextMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenu.RadioGroup>) => {
  return (
    <DropdownMenu.RadioGroup {...props} data-slot="context-menu-radio-group" />
  );
};

/* ------------------------------ Exports ------------------------------ */

const ContextMenuComposed = Object.assign(ContextMenu, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioItem: ContextMenuRadioItem,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Group: ContextMenuGroup,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
  RadioGroup: ContextMenuRadioGroup,
});

export {
  ContextMenuComposed as ContextMenu,
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
