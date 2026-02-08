import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "bg-secondary flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        "hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-foreground",
        "state-focus-ring",
        className,
      )}
      {...props}
    />
  );
}

const MenubarExports = Object.assign(Menubar, {
  Trigger: MenubarTrigger,
});

export { MenubarExports as Menubar, MenubarTrigger };
