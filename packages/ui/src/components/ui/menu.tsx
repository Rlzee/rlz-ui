import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";
import { MenuBase } from "@/components/base/menu-base";
import { Shortcut } from "@/components/base/shortcut";

function MenuRoot(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu-root" {...props} />;
}

function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

function MenuPopup({
  backdrop,
  backdropProps,
  positionerProps = {
    sideOffset: 8,
  },
  className,
  ...props
}: MenuPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: MenuPrimitive.Backdrop.Props;
  positionerProps?: MenuPrimitive.Positioner.Props;
}) {
  return (
    <MenuBase.Popup
      portalC={MenuPrimitive.Portal}
      popupC={MenuPrimitive.Popup}
      backdropC={MenuPrimitive.Backdrop}
      positionerC={MenuPrimitive.Positioner}
      backdrop={backdrop}
      backdropProps={backdropProps}
      positionerProps={positionerProps}
      className={className}
      {...props}
    />
  );
}

function MenuArrow(props: ArrowType) {
  return (
    <PopupArrow
      border={2}
      baseComponent={MenuPrimitive.Arrow}
      data-slot="menu-arrow"
      {...props}
    />
  );
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

function MenuGroupLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuBase.GroupLabel
      baseComponent={MenuPrimitive.GroupLabel}
      className={className}
      {...props}
    />
  );
}

function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuBase.Item
      baseComponent={MenuPrimitive.Item}
      className={className}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuBase.Separator
      baseComponent={MenuPrimitive.Separator}
      className={cn("mx-2 my-1.5", className)}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuBase.CheckboxItem
      itemC={MenuPrimitive.CheckboxItem}
      indicatorC={MenuPrimitive.CheckboxItemIndicator}
      className={className}
      checked={checked}
      {...props}
    >
      {children}
    </MenuBase.CheckboxItem>
  );
}

function MenuSubmenu(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-submenu-root" {...props} />;
}

function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuBase.SubmenuTrigger
      baseComponent={MenuPrimitive.SubmenuTrigger}
      className={className}
      {...props}
    >
      {children}
    </MenuBase.SubmenuTrigger>
  );
}

function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuBase.RadioItem
      itemC={MenuPrimitive.RadioItem}
      indicatorC={MenuPrimitive.RadioItemIndicator}
      className={className}
      {...props}
    >
      {children}
    </MenuBase.RadioItem>
  );
}

function MenuShortcut(props: React.ComponentProps<typeof Shortcut>) {
  return <Shortcut data-slot="menu-shortcut" {...props} />;
}

const MenuExports = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Item: MenuItem,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Shortcut: MenuShortcut,
});

export {
  MenuExports as Menu,
  MenuTrigger,
  MenuPopup,
  MenuArrow,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuCheckboxItem,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuRadioGroup,
  MenuRadioItem,
  MenuShortcut,
};
