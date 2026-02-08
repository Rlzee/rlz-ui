import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "@/lib/utils";
import { MenuBase } from "@/components/ui/base/menu-base";
import { Shortcut } from "@/components/ui/base/shortcut";

function ContextMenuRoot(props: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu-root" {...props} />;
}

function ContextMenuTrigger(props: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuPopup({
  backdrop,
  backdropProps,
  positionerProps = {
    sideOffset: 8,
  },
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: ContextMenuPrimitive.Backdrop.Props;
  positionerProps?: ContextMenuPrimitive.Positioner.Props;
}) {
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

function ContextMenuGroup(props: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuGroupLabel({
  className,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props) {
  return (
    <MenuBase.GroupLabel
      baseComponent={ContextMenuPrimitive.GroupLabel}
      className={className}
      {...props}
    />
  );
}

function ContextMenuItem({
  className,
  ...props
}: ContextMenuPrimitive.Item.Props) {
  return (
    <MenuBase.Item
      baseComponent={ContextMenuPrimitive.Item}
      className={className}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <MenuBase.Separator
      baseComponent={ContextMenuPrimitive.Separator}
      className={cn("mx-2 my-1.5", className)}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props) {
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

function ContextMenuSubmenu(props: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot
      data-slot="context-menu-submenu"
      {...props}
    />
  );
}

function ContextMenuSubmenuTrigger({
  className,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props) {
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

function ContextMenuRadioGroup(
  props: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>,
) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.RadioItem.Props) {
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

function ContextMenuShortcut(props: React.ComponentProps<typeof Shortcut>) {
  return <Shortcut data-slot="context-menu-shortcut" {...props} />;
}

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
