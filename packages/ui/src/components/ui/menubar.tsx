import * as React from "react";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

/* ------------------------------ Menubar ------------------------------ */

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive>) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "bg-secondary flex h-9 items-center gap-1 rounded-md border p-0.5 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Menubar Trigger ------------------------------ */

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none state-focus-ring",
        "hover:bg-primary/85 hover:text-primary-foreground data-popup-open:bg-accent data-popup-open:text-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const MenubarExports = Object.assign(Menubar, {
  Trigger: MenubarTrigger,
});

export { MenubarExports as Menubar, MenubarTrigger };
