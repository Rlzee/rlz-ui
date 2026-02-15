import * as React from "react";
import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Backdrop } from "@/components/base/backdrop";
import { Shortcut } from "@/components/base/shortcut";
import { cn } from "@/lib/utils";

const CommandCreateHandle = CommandDialogPrimitive.createHandle;

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

type CommandVariant = "default" | "attach" | "attach-bottom" | "attach-top";
const CommandVariantContext = React.createContext<CommandVariant>("default");
const useCommandVariant = () => React.useContext(CommandVariantContext);

function CommandRoot({
  variant = "default",
  autoHighlight = "always",
  keepHighlight = true,
  ...props
}: React.ComponentProps<typeof Autocomplete> & {
  variant?: CommandVariant;
}) {
  return (
    <CommandVariantContext.Provider value={variant}>
      <Autocomplete
        autoHighlight={autoHighlight}
        inline
        keepHighlight={keepHighlight}
        open
        {...props}
      />
    </CommandVariantContext.Provider>
  );
}

function CommandInput({
  className,
  placeholder,
  ...props
}: React.ComponentProps<typeof Autocomplete.Input>) {
  const variant = useCommandVariant();

  return (
    <Autocomplete.Input
      className={cn(
        variant === "attach" || variant === "attach-top"
          ? "border-b-0 rounded-b-none"
          : "",
        "h-11 py-4 md:text-base",
        "has-focus-visible:has-aria-invalid:ring-0 dark:has-focus-visible:has-aria-invalid:ring-0 has-focus-visible:has-aria-invalid:border-border",
        "has-focus-visible:ring-0 has-focus-visible:border-border",
        className
      )}
      placeholder={placeholder}
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
      className={cn("not-empty:scroll-py-2 not-empty:p-2", className)}
      data-slot="command-list"
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

function CommandBody({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useCommandVariant();

  return (
    <div
      className={cn(
        variant === "attach-top" || variant === "attach"
          ? "rounded-t-none!"
          : "mt-2",
        variant === "attach-bottom" || variant === "attach"
          ? "rounded-b-none!"
          : "",
        "bg-background border relative rounded-lg min-h-0 bg-clip-padding max-h-80",
        className
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.Group>) {
  return (
    <Autocomplete.Group
      className={className}
      data-slot="command-group"
      {...props}
    />
  );
}

function CommandGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.GroupLabel>) {
  return (
    <Autocomplete.GroupLabel
      className={className}
      data-slot="command-group-label"
      {...props}
    />
  );
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
      data-slot="command-item"
      className={cn("group/command-item", className)}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Autocomplete.Separator>) {
  return (
    <Autocomplete.Separator
      data-slot="command-separator"
      className={cn("my-2", className)}
      {...props}
    />
  );
}

function CommandFooter({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useCommandVariant();

  return (
    <div
      data-slot="command-footer"
      className={cn(
        variant === "attach-bottom" || variant === "attach"
          ? "rounded-t-none! border-t-0!"
          : "mt-2",
        "bg-popover border py-2 rounded-lg px-3 flex justify-between items-center",
        className
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Shortcut>) {
  return (
    <Shortcut
      data-slot="command-shortcut"
      className={cn(
        "text-md text-muted-foreground/50 group-data-highlighted/command-item:text-primary-foreground/80",
        className
      )}
      {...props}
    />
  );
}

const CommandDialogExports = Object.assign(CommandDialogRoot, {
  Portal: CommandDialogPortal,
  Trigger: CommandDialogTrigger,
  Popup: CommandDialogPopup,
});

const CommandExports = Object.assign(CommandRoot, {
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Body: CommandBody,
  Group: CommandGroup,
  GroupLabel: CommandGroupLabel,
  Collection: CommandCollection,
  Item: CommandItem,
  Separator: CommandSeparator,
  Footer: CommandFooter,
  Shortcut: CommandShortcut,
});

export {
  CommandCreateHandle,
  CommandDialogExports as CommandDialog,
  CommandDialogPortal,
  CommandDialogTrigger,
  CommandDialogPopup,
  CommandExports as Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandBody,
  CommandGroup,
  CommandGroupLabel,
  CommandCollection,
  CommandItem,
  CommandSeparator,
  CommandFooter,
  CommandShortcut,
};
