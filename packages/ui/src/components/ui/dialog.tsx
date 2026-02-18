import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Backdrop } from "@/components/base/backdrop";
import { Xclose } from "@/components/base/x-close";
import { cn } from "@/lib/utils";

type DialogVariant = "default" | "bare" | "bare-bottom" | "bare-top";
const DialogVariantContext = React.createContext<DialogVariant>("default");
const useDialogVariant = () => React.useContext(DialogVariantContext);

const DialogCreateHandle = DialogPrimitive.createHandle;

function DialogRoot({
  variant = "default",
  ...props
}: DialogPrimitive.Root.Props & { variant?: DialogVariant }) {
  return (
    <DialogVariantContext.Provider value={variant}>
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogVariantContext.Provider>
  );
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogViewport({
  className,
  ...props
}: DialogPrimitive.Viewport.Props) {
  return (
    <DialogPrimitive.Viewport
      data-slot="dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_2fr] justify-items-center p-4",
        className
      )}
      {...props}
    />
  );
}

function DialogBackdrop({
  className,
  blur,
  ...props
}: DialogPrimitive.Backdrop.Props & {
  blur?: boolean;
}) {
  return (
    <Backdrop
      data-slot="dialog-backdrop"
      baseComponent={DialogPrimitive.Backdrop}
      blur={blur}
      className={className}
      {...props}
    />
  );
}

function DialogCloseButton({
  className,
  ...props
}: DialogPrimitive.Close.Props) {
  return (
    <Xclose
      data-slot="dialog-close-button"
      baseComponent={DialogPrimitive.Close}
      className={className}
      {...props}
    />
  );
}

function DialogPopup({
  backdrop = true,
  backdropBlur,
  showCloseButton = true,
  children,
  className,
  ...props
}: DialogPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropBlur?: boolean;
  showCloseButton?: boolean;
}) {
  const variant = useDialogVariant();

  return (
    <DialogPortal>
      {backdrop && <DialogBackdrop blur={backdropBlur} />}
      <DialogViewport>
        <DialogPrimitive.Popup
          data-slot="dialog-popup"
          className={cn(
            variant === "bare" ? "bg-popover" : "bg-background",
            "relative row-start-2 flex max-h-[calc(100vh-8rem)] min-h-0 w-full min-w-0 max-w-lg flex-col rounded-lg border not-dark:bg-clip-padding text-popover-foreground transition-[scale,opacity,translate] duration-200",
            "-translate-y-[calc(1.5rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))] data-nested:data-ending-style:translate-y-8 data-nested:data-starting-style:translate-y-8 data-nested-dialog-open:origin-top",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95 data-ending-style:scale-95 data-starting-style:scale-95",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && <DialogCloseButton />}
        </DialogPrimitive.Popup>
      </DialogViewport>
    </DialogPortal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("ui-title", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("ui-description", className)}
      {...props}
    />
  );
}

function DialogBody({
  scrollClassName,
  scrollFade = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  scrollFade?: React.ComponentProps<typeof ScrollArea>["scrollFade"];
  scrollClassName?: React.ComponentProps<typeof ScrollArea>["className"];
}) {
  return (
    <ScrollArea scrollFade={scrollFade} className={scrollClassName}>
      <div
        data-slot="dialog-body"
        className={cn("flex flex-col gap-6 px-6 py-6", className)}
        {...props}
      />
    </ScrollArea>
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"footer">) {
  const variant = useDialogVariant();

  return (
    <footer
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-4",
        variant === "default" || variant === "bare-top"
          ? "pt-4 border-t border-border/50 bg-popover rounded-b-lg"
          : "",
        className
      )}
      {...props}
    />
  );
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"header">) => {
  const variant = useDialogVariant();

  return (
    <header
      data-slot="dialog-header"
      className={cn(
        "flex flex-col text-left gap-0.5 pt-4 px-6",
        variant === "default" || variant === "bare-bottom"
          ? "border-b border-border/50 pb-4 bg-popover rounded-t-lg"
          : "",
        className
      )}
      {...props}
    />
  );
};

const DialogExports = Object.assign(DialogRoot, {
  Portal: DialogPortal,
  Trigger: DialogTrigger,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
  Header: DialogHeader,
  Body: DialogBody,
  Viewport: DialogViewport,
  Backdrop: DialogBackdrop,
});

export {
  DialogCreateHandle,
  DialogExports as Dialog,
  DialogPortal,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogBody,
  DialogViewport,
  DialogBackdrop,
  useDialogVariant,
};
