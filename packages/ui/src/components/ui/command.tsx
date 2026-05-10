"use client";

import * as React from "react";

import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog";
import { Backdrop } from "@rlz/ui/components/base/backdrop";
import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";
import { Shortcut } from "@rlz/ui/components/base/shortcut";
import { cn } from "@rlz/ui/lib/cn";

export const CommandCreateHandle = CommandDialogPrimitive.createHandle;

function CommandDialogRoot(props: CommandDialogPrimitive.Root.Props) {
  return <CommandDialogPrimitive.Root data-slot="command-dialog" {...props} />;
}

function CommandDialogPortal(props: CommandDialogPrimitive.Portal.Props) {
  return (
    <CommandDialogPrimitive.Portal
      data-slot="command-dialog-portal"
      {...props}
    />
  );
}

function CommandDialogTrigger(props: CommandDialogPrimitive.Trigger.Props) {
  return (
    <CommandDialogPrimitive.Trigger
      data-slot="command-dialog-trigger"
      {...props}
    />
  );
}

function CommandDialogBackdrop({
  className,
  blur,
  ...props
}: CommandDialogPrimitive.Backdrop.Props & {
  blur?: boolean;
}) {
  return (
    <Backdrop
      data-slot="command-dialog-backdrop"
      baseComponent={CommandDialogPrimitive.Backdrop}
      blur={blur}
      className={className}
      {...props}
    />
  );
}

function CommandDialogViewport({
  className,
  ...props
}: CommandDialogPrimitive.Viewport.Props) {
  return (
    <CommandDialogPrimitive.Viewport
      data-slot="command-dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_2fr] justify-items-center p-4",
        className
      )}
      {...props}
    />
  );
}

function CommandDialogPopup({
  backdrop = true,
  backdropBlur,
  children,
  className,
  ...props
}: CommandDialogPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropBlur?: boolean;
}) {
  return (
    <CommandDialogPortal>
      {backdrop && <CommandDialogBackdrop blur={backdropBlur} />}
      <CommandDialogViewport>
        <CommandDialogPrimitive.Popup
          data-slot="command-dialog-popup"
          className={cn(
            "relative row-start-2 flex w-full max-w-xl min-h-0 min-w-0 flex-col",
            "-translate-y-[calc(1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))]",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
        </CommandDialogPrimitive.Popup>
      </CommandDialogViewport>
    </CommandDialogPortal>
  );
}

function CommandRoot({
  children,
  className,
  autoHighlight = "always",
  keepHighlight = true,
  ...props
}: React.ComponentProps<typeof Autocomplete> & {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-lg bg-popover p-2 border",
        className
      )}
    >
      <Autocomplete
        autoHighlight={autoHighlight}
        inline
        keepHighlight={keepHighlight}
        open
        {...props}
      >
        {children}
      </Autocomplete>
    </div>
  );
}

function CommandInput({
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof Autocomplete.Input>) {
  return (
    <Autocomplete.Input
      variant={variant}
      data-slot="command-input"
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.Empty>) {
  return (
    <Autocomplete.Empty
      className={cn("not-empty:py-6", className)}
      data-slot="command-empty"
      {...props}
    />
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.List>) {
  return (
    <Autocomplete.List
      data-slot="command-list"
      className={cn("relative min-h-0 bg-clip-padding max-h-80", className)}
      {...props}
    />
  );
}

function CommandGroup(props: React.ComponentProps<typeof Autocomplete.Group>) {
  return <Autocomplete.Group data-slot="command-group" {...props} />;
}

function CommandGroupLabel(
  props: React.ComponentProps<typeof Autocomplete.GroupLabel>
) {
  return <Autocomplete.GroupLabel data-slot="command-group-label" {...props} />;
}

function CommandCollection({
  ...props
}: React.ComponentProps<typeof Autocomplete.Collection>) {
  return <Autocomplete.Collection data-slot="command-collection" {...props} />;
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.Item>) {
  return (
    <Autocomplete.Item
      className={cn("group/command-item", className)}
      data-slot="command-item"
      {...props}
    />
  );
}

function CommandSeparator(
  props: React.ComponentProps<typeof Autocomplete.Separator>
) {
  return <Autocomplete.Separator data-slot="command-separator" {...props} />;
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Shortcut>) {
  return (
    <Shortcut
      data-slot="command-shortcut"
      className={cn(
        "text-xs group-hover/command-item:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex items-center justify-between text-xs text-muted-foreground gap-2 px-3 py-3 rounded-b-lg bg-background -mx-2 -mb-2 border-t border-t-border/50",
        className
      )}
      {...props}
    />
  );
}

const CommandDialogExports = Object.assign(CommandDialogRoot, {
  Portal: CommandDialogPortal,
  Trigger: CommandDialogTrigger,
  Backdrop: CommandDialogBackdrop,
  Viewport: CommandDialogViewport,
  Popup: CommandDialogPopup,
});

const CommandExports = Object.assign(CommandRoot, {
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  GroupLabel: CommandGroupLabel,
  Collection: CommandCollection,
  Item: CommandItem,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Footer: CommandFooter,
});

export {
  CommandExports as Command,
  CommandDialogExports as CommandDialog,
  CommandDialogPortal,
  CommandDialogViewport,
  CommandDialogTrigger,
  CommandDialogBackdrop,
  CommandDialogPopup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandFooter,
};
