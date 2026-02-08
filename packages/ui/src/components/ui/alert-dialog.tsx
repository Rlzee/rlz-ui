import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Backdrop } from "@/components/ui/base/backdrop";
import { cn } from "@/lib/utils";

const AlertDialogCreateHandle = AlertDialogPrimitive.createHandle;

function AlertDialogRoot(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogViewport({
  className,
  ...props
}: AlertDialogPrimitive.Viewport.Props) {
  return (
    <AlertDialogPrimitive.Viewport
      data-slot="alert-dialog-viewport"
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_2fr] justify-items-center p-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogBackdrop({
  className,
  blur,
  ...props
}: AlertDialogPrimitive.Backdrop.Props & {
  blur?: boolean;
}) {
  return (
    <Backdrop
      data-slot="alert-dialog-backdrop"
      baseComponent={AlertDialogPrimitive.Backdrop}
      blur={blur}
      className={className}
      {...props}
    />
  );
}

function AlertDialogPopup({
  backdrop = true,
  backdropProps,
  children,
  className,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof AlertDialogBackdrop>;
}) {
  return (
    <AlertDialogPortal>
      {backdrop && (
        <AlertDialogBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <AlertDialogViewport>
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-popup"
          className={cn(
            "bg-background [&:has([data-slot=alert-dialog-actions][data-variant=bare])]:bg-popover",
            "relative row-start-2 flex w-full max-w-md flex-col rounded-lg border text-popover-foreground gap-0.5 min-h-0 min-w-0 max-h-[calc(100vh-8rem)]",
            "-translate-y-[calc(1.25rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))]",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            className,
          )}
          {...props}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogViewport>
    </AlertDialogPortal>
  );
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold px-6 pt-4", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground px-6 pb-4", className)}
      {...props}
    />
  );
}

function AlertDialogActions({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"footer"> & {
  variant?: "default" | "bare";
}) {
  return (
    <footer
      data-slot="alert-dialog-actions"
      data-variant={variant}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end px-6 pb-4",
        "data-[variant=default]:bg-popover data-[variant=default]:border-border/50 data-[variant=default]:border-t data-[variant=default]:pt-4 data-[variant=default]:rounded-b-lg",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogClose(props: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const AlertDialogExports = Object.assign(AlertDialogRoot, {
  Portal: AlertDialogPortal,
  Trigger: AlertDialogTrigger,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
  Actions: AlertDialogActions,
});

export {
  AlertDialogCreateHandle,
  AlertDialogExports as AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogActions,
};
