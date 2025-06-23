"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

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
}: React.ComponentProps<typeof CommandPrimitive>) => {
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
}

/* ---------------------------- Command Dialog ----------------------------- */

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
  className?: string;
  shortcutKey?: string; // ex: 'k'
}

const CommandDialog = ({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  shortcutKey = "k",
  open: controlledOpen,
  onOpenChange,
  ...props
}: CommandDialogProps) => {
  const { getPortalState, openPortal, closePortal } = usePortal();
  const isOpen = getPortalState(CommandPortalName);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        if (isOpen) {
          closePortal(CommandPortalName);
        } else {
          openPortal(CommandPortalName);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => closePortal(CommandPortalName)}
      {...props}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={false}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[data-slot=command-input-wrapper]]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------- Command Input ----------------------------- */

interface CommandInputProps
  extends React.ComponentProps<typeof CommandPrimitive.Input> {
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
      className="flex h-9 items-center gap-2 border-b px-3"
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
        <kbd
          data-slot="command-input-shortcut"
          onClick={() => closePortal(CommandPortalName)}
          className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-background text-muted-foreground text-[12px] font-mono rounded-md shadow-sm transition cursor-pointer"
        >
          Esc
        </kbd>
      )}
    </div>
  );
}

/* ----------------------------- Command List ----------------------------- */

const CommandList = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) => {
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
}

/* ----------------------------- Command Empty ----------------------------- */

const CommandEmpty = ({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

/* ----------------------------- Command Group ----------------------------- */

const CommandGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) => {
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
}

/* ----------------------------- Command Separator ----------------------------- */

const CommandSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) => {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

/* ----------------------------- Command Item ----------------------------- */

const CommandItem = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) => {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

/* ----------------------------- Command Shortcut ----------------------------- */

const CommandShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

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
