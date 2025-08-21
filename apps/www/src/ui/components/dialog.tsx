import { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { XIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Dialog ------------------------------ */

const Dialog = (props: ComponentProps<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

/* ---------------------------- Dialog Trigger --------------------------- */

const DialogTrigger = (
  props: ComponentProps<typeof DialogPrimitive.Trigger>
) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

/* ---------------------------- Dialog Portal --------------------------- */

const DialogPortal = (props: ComponentProps<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

/* ---------------------------- Dialog Close --------------------------- */

const DialogClose = (props: ComponentProps<typeof DialogPrimitive.Close>) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

/* ---------------------------- Dialog Overlay --------------------------- */

const DialogOverlay = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
};

/* ---------------------------- Dialog Content --------------------------- */

interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content> {
  overlay?: boolean;
  showCloseButton?: boolean;
}

const DialogContent = ({
  className,
  children,
  overlay = true,
  showCloseButton = true,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-border p-6 duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        <VisuallyHidden>
          <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
        </VisuallyHidden>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-muted data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
};

/* ------------------------------ Dialog Header ------------------------------ */

const DialogHeader = ({ className, ...props }: ComponentProps<"header">) => {
  return (
    <header
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
};

/* ------------------------------ Dialog Body ------------------------------ */

const DialogBody = ({ className, ...props }: ComponentProps<"main">) => {
  return (
    <main
      data-slot="dialog-body"
      className={cn("grid gap-4", className)}
      {...props}
    />
  );
};

/* ------------------------------ Dialog Footer ------------------------------ */

const DialogFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Dialog Title ------------------------------ */

const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
};

/* ------------------------------ Dialog Description ------------------------------ */

const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const DialogComposant = Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});

export {
  DialogComposant as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
