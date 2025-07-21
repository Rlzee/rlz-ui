"use client";

import { ComponentProps } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Kbd } from "@/src/ui/components/kbd";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Menubar ------------------------------ */

const Menubar = ({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Root>) => {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background-secondary flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    />
  );
};

/* ---------------------------- Menubar Menu --------------------------- */

const MenubarMenu = (props: ComponentProps<typeof MenubarPrimitive.Menu>) => {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
};

/* ---------------------------- Menubar Group --------------------------- */

const MenubarGroup = (props: ComponentProps<typeof MenubarPrimitive.Group>) => {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
};

/* ---------------------------- Menubar Portal --------------------------- */

const MenubarPortal = (
  props: ComponentProps<typeof MenubarPrimitive.Portal>
) => {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
};

/* ---------------------------- Menubar Radio Group --------------------------- */

const MenubarRadioGroup = (
  props: ComponentProps<typeof MenubarPrimitive.RadioGroup>
) => {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
};

/* ---------------------------- Menubar Trigger --------------------------- */

const MenubarTrigger = ({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Trigger>) => {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-muted focus:text-muted-foreground data-[state=open]:bg-muted data-[state=open]:text-muted-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Menubar Content ------------------------------ */

const MenubarContent = ({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Content>) => {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
};

/* ------------------------------ Menubar Item ------------------------------ */

const MenubarItem = ({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) => {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-secondary data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Menubar Checkbox Item ------------------------------ */

const MenubarCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) => {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-secondary relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
};

/* ------------------------------ Menubar Radio Item ------------------------------ */

const MenubarRadioItem = ({
  className,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.RadioItem>) => {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-secondary relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
};

/* ------------------------------ Menubar Label ------------------------------ */

const MenubarLabel = ({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) => {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Menubar Separator ------------------------------ */

const MenubarSeparator = ({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.Separator>) => {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

/* ------------------------------ Menubar Shortcut ------------------------------ */

const MenubarShortcut = ({
  className,
  shortcutKey,
  ...props
}: ComponentProps<typeof Kbd>) => {
  return (
    <Kbd
      data-slot="menubar-shortcut"
      shortcutKey={shortcutKey}
      className={cn("ml-auto tracking-widest", className)}
      {...props}
    />
  );
};

/* ------------------------------ Menubar Sub ------------------------------ */

const MenubarSub = (props: ComponentProps<typeof MenubarPrimitive.Sub>) => {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
};

/* ------------------------------ Menubar Sub Trigger ------------------------------ */

const MenubarSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) => {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-secondary data-[state=open]:bg-secondary flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
};

/* ------------------------------ Menubar Sub Content ------------------------------ */

const MenubarSubContent = ({
  className,
  ...props
}: ComponentProps<typeof MenubarPrimitive.SubContent>) => {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const MenubarComposant = Object.assign(Menubar, {
  Portal: MenubarPortal,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Group: MenubarGroup,
  Separator: MenubarSeparator,
  Label: MenubarLabel,
  Item: MenubarItem,
  Shortcut: MenubarShortcut,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  Sub: MenubarSub,
  SubTrigger: MenubarSubTrigger,
  SubContent: MenubarSubContent,
});

export {
  MenubarComposant as Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
