import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";

/* ------------------------------ Root AlertDialog ------------------------------ */

function AlertDialogRoot(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Root>
) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/* -------------------------- AlertDialog Trigger -------------------------- */

function AlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>
) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

/* -------------------------- AlertDialog Popup -------------------------- */

type AlertDialogPopupProps = React.ComponentProps<
  typeof AlertDialogPrimitive.Popup
> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof AlertDialogPrimitive.Backdrop>;
};

function AlertDialogPopup({
  backdrop = true,
  backdropProps,
  className,
  ...props
}: AlertDialogPopupProps) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      {backdrop && (
        <AlertDialogPrimitive.Backdrop
          data-slot="alert-dialog-backdrop"
          className={cn(
            "fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute",
            backdropProps?.className
          )}
          {...backdropProps}
        />
      )}
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-popup"
        className={cn(
          "bg-popover data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border p-6 duration-200 sm:max-w-lg gap-2",
          className
        )}
        {...props}
      >
        {props.children}
      </AlertDialogPrimitive.Popup>
    </AlertDialogPrimitive.Portal>
  );
}

/* -------------------------- AlertDialog Title -------------------------- */

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

/* ----------------------- AlertDialog Description ----------------------- */

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ----------------------- AlertDialog Close ----------------------- */

function AlertDialogClose({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Close>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-close"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const AlertDialogExports = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
});

export {
  AlertDialogExports as AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
};
