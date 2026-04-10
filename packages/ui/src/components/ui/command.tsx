import * as React from "react";
import { Dialog as CommandDialogPrimitive } from "@base-ui/react/dialog";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Backdrop } from "@/components/base/backdrop";
import { Shortcut } from "@/components/base/shortcut";
import { cn } from "@/lib/cn";

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

type CommandVariant = "default" | "detached-top" | "bare" | "frame";
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

  const variantClasses: Record<string, string | false> = {
    default:
      "rounded-b-none border-b-border/50 has-focus-visible:border-b-border/50",
    frame: "!border-border/15 border-b-0 -mb-4 py-9.5 pt-6",
    "detached-top": "border-b-border rounded-b-lg mb-2",
    bare: false,
  };

  const inputClass = cn(
    "h-11 md:text-base",
    "has-focus-visible:has-aria-invalid:ring-0 dark:has-focus-visible:has-aria-invalid:ring-0 has-focus-visible:has-aria-invalid:border-border",
    "has-focus-visible:ring-0 has-focus-visible:border-border",
    variant !== "bare" && variantClasses.default,
    variantClasses[variant],
    className
  );

  const input = (
    <Autocomplete.Input
      className={inputClass}
      placeholder={placeholder}
      {...props}
    />
  );

  if (variant === "bare") {
    return (
      <div className="border border-b-0 px-3 pt-2 bg-popover rounded-t-lg">
        {input}
      </div>
    );
  }

  return input;
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
        variant === "bare" ? "bg-popover" : "bg-background",
        variant === "frame" && "rounded-lg border",
        variant === "detached-top" && "rounded-t-lg border-t",
        "border-x relative min-h-0 bg-clip-padding max-h-80",
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
      className={cn("group/command-item py-2.5", className)}
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
        "bg-popover py-3 border rounded-b-lg px-3 flex justify-between items-center border-t-border/50",
        variant === "frame" && "-mt-2 border-border/15 pt-4.5",
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
      className={cn("text-md", className)}
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
