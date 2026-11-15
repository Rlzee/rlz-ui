"use client";

import type * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { MenuPopup } from "@rlz/ui/components/ui/menu";

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

function ContextMenuPopup({
  children,
  ...props
}: React.ComponentProps<typeof MenuPopup>) {
  return (
    <MenuPopup
      {...props}
      positionnerProps={{
        sideOffset: 0,
        alignOffset: 0,
        ...props.positionnerProps,
      }}
    >
      {children}
    </MenuPopup>
  );
}

const ExportsContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Popup: ContextMenuPopup,
});

export {
  ExportsContextMenu as ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopup,
};
