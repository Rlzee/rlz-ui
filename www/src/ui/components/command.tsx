"use client";

import { ComponentProps, ReactNode } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { Kbd } from "./kbd";

import { cn } from "@/src/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/dialog";
import { usePortal } from "@/src/ui/stores/portal.store";

const CommandPortalName = "command-dialog";

/* ------------------------------ Root Command ------------------------------ */

const Command = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive>) => {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  );
};

/* ---------------------------- Command Dialog ----------------------------- */

type CommandDialogProps = {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

const CommandDialog = ({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
}: CommandDialogProps) => {
  const { getPortalState, closePortal } = usePortal();
  const isOpen = getPortalState(CommandPortalName);

  return (
    <Dialog open={isOpen} onOpenChange={() => closePortal(CommandPortalName)}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0 border-border", className)}
        showCloseButton={false}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[data-slot=command-input-wrapper]]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------------------- Command Input ----------------------------- */

interface CommandInputProps
  extends ComponentProps<typeof CommandPrimitive.Input> {
  className?: string;
  kbd?: boolean; // Whether to show the Esc shortcut
}

const CommandInput = ({
  className,
  kbd = true, // Default to true to show Esc shortcut
  ...props
}: CommandInputProps) => {
  const { closePortal } = usePortal();

  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b border-border px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {kbd && (
        <Kbd
          className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[12px] font-mono rounded-md shadow-sm transition cursor-pointer"
          shortcutKey="Esc"
          onClick={() => closePortal(CommandPortalName)}
        />
      )}
    </div>
  );
};

/* ----------------------------- Command List ----------------------------- */

const CommandList = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.List>) => {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className={cn(
        "max-h-[300px] overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  );
};

/* ----------------------------- Command Empty ----------------------------- */

const CommandEmpty = ({
  ...props
}: ComponentProps<typeof CommandPrimitive.Empty>) => {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
};

/* ----------------------------- Command Group ----------------------------- */

const CommandGroup = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Group>) => {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  );
};

/* ----------------------------- Command Separator ----------------------------- */

const CommandSeparator = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) => {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
};

/* ----------------------------- Command Item ----------------------------- */

const CommandItem = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) => {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-secondary data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
};

/* ----------------------------- Command Shortcut ----------------------------- */

const CommandShortcut = ({
  className,
  ...props
}: ComponentProps<typeof Kbd>) => {
  return (
    <Kbd
      data-slot="command-shortcut"
      className={cn("tracking-widest ml-auto", className)}
      {...props}
    />
  );
};

/* ----------------------------- Exports ----------------------------- */

export {
  CommandPortalName,
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
