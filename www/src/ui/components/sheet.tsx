"use client";

import { ComponentProps, createContext, useContext } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

/* ------------------------------ Context Sheet ------------------------------ */

export type SheetDirection = "top" | "right" | "bottom" | "left";

const SheetDirectionContext = createContext<SheetDirection>("right");

export const useSheetDirection = () => useContext(SheetDirectionContext);

/* ------------------------------ Root Sheet ------------------------------ */

const Sheet = ({
  direction = "right",
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root> & {
  direction?: SheetDirection;
}) => {
  return (
    <SheetDirectionContext.Provider value={direction}>
      <SheetPrimitive.Root
        data-slot="sheet"
        data-direction={direction}
        {...props}
      >
        {children}
      </SheetPrimitive.Root>
    </SheetDirectionContext.Provider>
  );
};

/* ------------------------------ Sheet Tirgger ------------------------------ */

const SheetTrigger = (props: ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
};

/* ------------------------------ Sheet Close ------------------------------ */

const SheetClose = (props:ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
};

/* ------------------------------ Sheet Portal ------------------------------ */

const SheetPortal = (props: ComponentProps<typeof SheetPrimitive.Portal>) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
};

/* ------------------------------ Sheet Overlay ------------------------------ */

const SheetOverlay = ({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) => {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Sheet Content ------------------------------ */

interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content> {
  overlay?: boolean;
}

const SheetContent = ({
  className,
  children,
  overlay = true,
  ...props
}: SheetContentProps) => {
  const direction = useSheetDirection();

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-direction={direction}
        className={cn(
          "bg-background-secondary data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          "data-[direction=left]:data-[state=closed]:slide-out-to-left data-[direction=left]:data-[state=open]:slide-in-from-left data-[direction=left]:inset-y-0 data-[direction=left]:left-0 data-[direction=left]:h-full data-[direction=left]:w-3/4 data-[direction=left]:border-r data-[direction=left]:sm:max-w-sm",
          "data-[direction=right]:data-[state=closed]:slide-out-to-right data-[direction=right]:data-[state=open]:slide-in-from-right data-[direction=right]:inset-y-0 data-[direction=right]:right-0 data-[direction=right]:h-full data-[direction=right]:w-3/4 data-[direction=right]:border-l data-[direction=right]:sm:max-w-sm",
          "data-[direction=top]:data-[state=closed]:slide-out-to-top data-[direction=top]:data-[state=open]:slide-in-from-top data-[direction=top]:inset-x-0 data-[direction=top]:top-0 data-[direction=top]:h-auto data-[direction=top]:border-b",
          "data-[direction=bottom]:data-[state=closed]:slide-out-to-bottom data-[direction=bottom]:data-[state=open]:slide-in-from-bottom data-[direction=bottom]:inset-x-0 data-[direction=bottom]:bottom-0 data-[direction=bottom]:h-auto data-[direction=bottom]:border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
};

/* ------------------------------ Sheet Header ------------------------------ */

const SheetHeader = ({ className, ...props }: ComponentProps<"header">) => {
  return (
    <header
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
};

/* ------------------------------ Sheet Body ------------------------------ */

const SheetBody = ({ className, ...props }: ComponentProps<"main">) => {
  return (
    <main
      data-slot="sheet-body"
      className={cn("px-4 grid gap-6", className)}
      {...props}
    />
  );
};

/* ------------------------------ Sheet Footer ------------------------------ */

const SheetFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
};

/* ------------------------------ Sheet Title ------------------------------ */

const SheetTitle = ({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Title>) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
};

/* ------------------------------ Sheet Description ------------------------------ */

const SheetDescription = ({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) => {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const SheetComposed = Object.assign(Sheet, {
  Trigger: SheetTrigger,
  Close: SheetClose,
  Content: SheetContent,
  Header: SheetHeader,
  Body: SheetBody,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
});

export {
  SheetComposed as Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
