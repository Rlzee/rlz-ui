import * as React from "react";
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Toolbar ------------------------------ */

function ToolbarRoot({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex items-center h-9 gap-px rounded-md border p-0.5 bg-secondary shadow-xs",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Toolbar Group ------------------------------ */

function ToolbarGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Group>) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      aria-label="Alignment"
      className={cn("flex gap-1", className)}
      {...props}
    />
  );
}

/* ------------------------------ Toolbar Button ------------------------------ */

function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button>) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none state-focus-ring",
        "hover:bg-primary/85 hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Toolbar Separator ------------------------------ */

function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("bg-border h-4 w-px mx-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Toolbar Link ------------------------------ */

function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(
        "text-muted-foreground hover:text-foreground no-underline text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Toolbar Input ------------------------------ */

function ToolbarInput({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Input>) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      className={cn(
        "file:text-foreground selection:bg-primary selection:text-primary-foreground bg-accent outline-none border placeholder:text-muted-foreground rounded-sm px-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "state-invalid state-focus-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const ToolbarExports = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
  Input: ToolbarInput,
});

export {
  ToolbarExports as Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarInput,
};
