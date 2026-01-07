import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "@/lib/utils";
import { MenuBase } from "@/components/base/menu-base";

/* -------------------------- Context Menu Root -------------------------- */

function ContextMenuRoot(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Root>
) {
  return <ContextMenuPrimitive.Root data-slot="context-menu-root" {...props} />;
}

/* ----------------------- Context Menu Trigger ----------------------- */

function ContextMenuTrigger(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>
) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

/* ----------------------- Context Menu Popup ----------------------- */

type MenuPopupProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Popup
> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof ContextMenuPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<
    typeof ContextMenuPrimitive.Positioner
  >;
};

function ContextMenuPopup({
  backdrop,
  backdropProps,
  positionerProps = {
    sideOffset: 8,
  },
  className,
  ...props
}: MenuPopupProps) {
  return (
    <MenuBase.Popup
      portalC={ContextMenuPrimitive.Portal}
      popupC={ContextMenuPrimitive.Popup}
      backdropC={ContextMenuPrimitive.Backdrop}
      positionerC={ContextMenuPrimitive.Positioner}
      backdrop={backdrop}
      backdropProps={backdropProps}
      positionerProps={positionerProps}
      className={className}
      {...props}
    />
  );
}

/* ----------------------- Context Menu Group ----------------------- */

function ContextMenuGroup(
  props: React.ComponentProps<typeof ContextMenuPrimitive.Group>
) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

/* -------------------- Context Menu Group Label -------------------- */

function ContextMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel>) {
  return (
    <MenuBase.GroupLabel
      baseComponent={ContextMenuPrimitive.GroupLabel}
      className={className}
      {...props}
    />
  );
}

/* ----------------------- Context Menu Item ----------------------- */

function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item>) {
  return (
    <MenuBase.Item
      baseComponent={ContextMenuPrimitive.Item}
      className={className}
      {...props}
    />
  );
}

/* ----------------------- Context Menu Separator ----------------------- */

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <MenuBase.Separator
      baseComponent={ContextMenuPrimitive.Separator}
      className={cn("mx-2 my-1.5", className)}
      {...props}
    />
  );
}

/* ------------------------------ Context Menu Checkbox Item ------------------------------ */

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <MenuBase.CheckboxItem
      itemC={ContextMenuPrimitive.CheckboxItem}
      indicatorC={ContextMenuPrimitive.CheckboxItemIndicator}
      className={className}
      checked={checked}
      {...props}
    >
      {children}
    </MenuBase.CheckboxItem>
  );
}

/* ----------------------- Context Menu Submenu ----------------------- */

function ContextMenuSubmenu(
  props: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot>
) {
  return (
    <ContextMenuPrimitive.SubmenuRoot
      data-slot="context-menu-submenu"
      {...props}
    />
  );
}

/* ----------------------- Context Menu Submenu Trigger ----------------------- */

function ContextMenuSubmenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger>) {
  return (
    <MenuBase.SubmenuTrigger
      baseComponent={ContextMenuPrimitive.SubmenuTrigger}
      className={className}
      {...props}
    >
      {children}
    </MenuBase.SubmenuTrigger>
  );
}

/* ---------------------------- Context Menu Radio Group --------------------------- */

function ContextMenuRadioGroup(
  props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>
) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

/* ---------------------------- Context Menu Radio Item --------------------------- */

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <MenuBase.RadioItem
      itemC={ContextMenuPrimitive.RadioItem}
      indicatorC={ContextMenuPrimitive.RadioItemIndicator}
      className={className}
      {...props}
    >
      {children}
    </MenuBase.RadioItem>
  );
}

/* ---------------------------- Context Menu Shortcut --------------------------- */

function ContextMenuShortcut({
  className,
  children,
}: React.ComponentProps<"span">) {
  return (
    <MenuBase.Shortcut className={className}>{children}</MenuBase.Shortcut>
  );
}

/* ----------------------- Exports ----------------------- */

const ContextMenuExports = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Popup: ContextMenuPopup,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  CheckboxItem: ContextMenuCheckboxItem,
  Submenu: ContextMenuSubmenu,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Shortcut: ContextMenuShortcut,
});

export {
  ContextMenuExports as ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopup,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuSubmenu,
  ContextMenuSubmenuTrigger,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuShortcut,
};
