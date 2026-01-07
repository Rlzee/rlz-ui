import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

/* --------------------------- Variant Context --------------------------- */

type DialogVariant = "default" | "sticky";
const DialogVariantContext = React.createContext<DialogVariant>("default");
const useDialogVariant = () => React.useContext(DialogVariantContext);

/* ------------------------------ Root Dialog ------------------------------ */

function DialogRoot(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/* -------------------------- Dialog Trigger -------------------------- */

function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/* -------------------------- Dialog Popup -------------------------- */

type DialogPopupProps = React.ComponentProps<typeof DialogPrimitive.Popup> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof DialogPrimitive.Backdrop>;
  showCloseButton?: boolean;
  variant?: DialogVariant;
};

function DialogPopup({
  backdrop = true,
  backdropProps,
  showCloseButton = true,
  className,
  variant = "default",
  ...props
}: DialogPopupProps) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      {backdrop && (
        <DialogPrimitive.Backdrop
          data-slot="dialog-backdrop"
          className={cn(
            "fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute",
            backdropProps?.className
          )}
          {...backdropProps}
        />
      )}
      <DialogVariantContext.Provider value={variant}>
        <DialogPrimitive.Popup
          data-slot="dialog-popup"
          className={cn(
            "bg-popover fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border duration-200 sm:max-w-lg",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",

            variant === "sticky"
              ? "flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)]"
              : "p-6 gap-4",

            className
          )}
          {...props}
        >
          {props.children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close-button-x"
              className="ring-offset-background focus:ring-ring data-open:bg-accent data-open:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogVariantContext.Provider>
    </DialogPrimitive.Portal>
  );
}

/* -------------------------- Dialog Title -------------------------- */

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------- Dialog Description -------------------------- */

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* -------------------------- Dialog Body -------------------------- */

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  const variant = useDialogVariant();

  return (
    <div
      data-slot="dialog-body"
      className={cn(
        variant === "sticky" ? "flex-1 overflow-y-auto px-6 py-4" : "space-y-4",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------- Dialog Close -------------------------- */

function DialogClose({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const variant = useDialogVariant();

  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn(
        variant === "sticky"
          ? "border-t px-6 py-4 sm:items-center flex gap-2 sm:justify-end"
          : "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------- Dialog Header -------------------------- */

const DialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"header">) => {
  const variant = useDialogVariant();

  return (
    <header
      data-slot="dialog-header"
      className={cn(
        variant === "sticky"
          ? "flex flex-col gap-1 text-left border-b px-6 py-4"
          : "flex flex-col gap-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const DialogExports = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Header: DialogHeader,
  Body: DialogBody,
});

export {
  DialogExports as Dialog,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogBody,
};
