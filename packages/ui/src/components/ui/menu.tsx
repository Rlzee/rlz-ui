import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";
import { MenuBase } from "@/components/base/menu-base";
import { Shortcut } from "@/components/base/shortcut";

/* ------------------------------ Root Menu ------------------------------ */

function MenuRoot(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="menu-root" {...props} />;
}

/* ------------------------------ Menu Trigger ------------------------------ */

function MenuTrigger(
  props: React.ComponentProps<typeof MenuPrimitive.Trigger>
) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

/* ------------------------------ Menu Popup ------------------------------ */

type MenuPopupProps = React.ComponentProps<typeof MenuPrimitive.Popup> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof MenuPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<typeof MenuPrimitive.Positioner>;
};

function MenuPopup({
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

/* ------------------------------ Menu Arrow ------------------------------ */

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

/* ------------------------------ Menu Group ------------------------------ */

function MenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

/* ------------------------------ Menu Group Label ------------------------------ */

function MenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel>) {
  return (
    <MenuBase.GroupLabel
      baseComponent={MenuPrimitive.GroupLabel}
      className={className}
      {...props}
    />
  );
}

/* ------------------------------ Menu Item ------------------------------ */

function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuBase.Item
      baseComponent={MenuPrimitive.Item}
      className={className}
      {...props}
    />
  );
}

/* ------------------------------ Menu Separator ------------------------------ */

function MenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuBase.Separator
      baseComponent={MenuPrimitive.Separator}
      className={cn("mx-2 my-1.5", className)}
      {...props}
    />
  );
}

/* ------------------------------ Menu Checkbox Item ------------------------------ */

function MenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
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

/* ------------------------------ Menu Submenu ------------------------------ */

function MenuSubmenu(
  props: React.ComponentProps<typeof MenuPrimitive.SubmenuRoot>
) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-submenu-root" {...props} />;
}

/* ------------------------------ Menu Submenu Trigger ------------------------------ */

function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger>) {
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

/* ---------------------------- Menu Radio Group --------------------------- */

function MenuRadioGroup(
  props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>
) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

/* ---------------------------- Menu Radio Item --------------------------- */

function MenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
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

/* ---------------------------- Menu Shortcut --------------------------- */

function MenuShortcut(props: React.ComponentProps<typeof Shortcut>) {
  return <Shortcut data-slot="menu-shortcut" {...props} />;
}

/* ---------------------------- Exports --------------------------- */

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
