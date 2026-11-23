"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

function ContextMenuRoot(props: ContextMenuPrimitive.Root.Props) {
  return (
    <MenuPrimitive.FilterProvider>
      <ContextMenuPrimitive.Root {...props} />
    </MenuPrimitive.FilterProvider>
  );
}

function ContextMenuTrigger(props: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

const ExportsContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
});

export { ExportsContextMenu as ContextMenu, ContextMenuTrigger };
