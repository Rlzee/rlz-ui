"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { PopupArrow } from "@rlz/ui/components/base/popup-arrow";
import { Shortcut } from "@rlz/ui/components/base/shortcut";
import { Input, type InputProps } from "@rlz/ui/components/ui/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Check, X } from "lucide-react";

const menuItemVariants = cva(
  cn(
    "group/menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
    "data-disabled:pointer-events-none data-disabled:opacity-50",

    "data-highlighted:relative data-highlighted:z-0",
    "data-highlighted:before:absolute data-highlighted:before:inset-0",
    "data-highlighted:before:rounded-sm",
    "data-highlighted:before:-z-10",

    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: [
          "text-foreground data-highlighted:text-accent-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-muted",
          "data-highlighted:before:bg-accent/70",
          "[&_svg:not([class*='text-'])]:text-muted",
        ],
        destructive: [
          "text-destructive data-highlighted:text-destructive data-highlighted:[&_svg:not([class*='text-'])]:text-destructive",
          "data-highlighted:before:bg-accent/70",
          "[&_svg:not([class*='text-'])]:text-destructive",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const menuCheckboxItemVariants = cva(
  [
    "grid items-center gap-2",
    "in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)]",
    "cursor-default text-sm text-foreground outline-none rounded-sm py-1.5 px-2",
    "data-highlighted:bg-accent/70 data-highlighted:text-accent-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "grid-cols-[.75rem_1fr] pe-4",
        solid: "grid-cols-[1fr_auto] gap-4 pe-1.5",
        switch: "grid-cols-[1fr_auto] gap-4 pe-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const MenuCreateHandle: typeof MenuPrimitive.createHandle =
  MenuPrimitive.createHandle;

function MenuRoot(props: MenuPrimitive.Root.Props) {
  return (
    <MenuPrimitive.FilterProvider>
      <MenuPrimitive.Root {...props} />
    </MenuPrimitive.FilterProvider>
  );
}

function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

function MenuPortal(props: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="menu-portal" {...props} />;
}

function MenuPositioner(props: MenuPrimitive.Positioner.Props) {
  return <MenuPrimitive.Positioner data-slot="menu-positioner" {...props} />;
}

function MenuBackdrop(props: MenuPrimitive.Backdrop.Props) {
  return <MenuPrimitive.Backdrop data-slot="menu-backdrop" {...props} />;
}

function MenuPopup({
  children,
  backdrop,
  backdropProps,
  positionnerProps,
  className,
  ...props
}: MenuPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: MenuPrimitive.Backdrop.Props;
  positionnerProps?: MenuPrimitive.Positioner.Props;
}) {
  const {
    sideOffset = 8,
    className: positionnerClassName,
    ...restPositionerProps
  } = positionnerProps ?? {};

  return (
    <MenuPortal>
      {backdrop && <MenuBackdrop {...backdropProps} />}
      <MenuPositioner
        style={{ zIndex: 50 }}
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionnerClassName}
      >
        <MenuPrimitive.Popup
          data-slot="menu-popup"
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-32 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2",
            "has-data-[slot=menu-input]:p-2",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPositioner>
    </MenuPortal>
  );
}

function MenuClear({ className, ...props }: MenuPrimitive.Clear.Props) {
  return (
    <MenuPrimitive.Clear
      data-slot="menu-clear"
      className={cn(
        "cursor-pointer flex text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      <X className="h-3.5 w-3.5" />
    </MenuPrimitive.Clear>
  );
}

function MenuInput({
  variant = "primary",
  unstyled = false,
  clearable = false,
  className,
  ...props
}: MenuPrimitive.Input.Props & {
  variant?: InputProps["variant"];
  unstyled?: InputProps["unstyled"];
  clearable?: boolean;
}) {
  const input = (
    <MenuPrimitive.Input
      data-slot="menu-input"
      render={
        <Input
          nativeInput
          variant={variant}
          unstyled={unstyled}
          className="w-full has-disabled:opacity-50"
        />
      }
      className={cn("h-9", !clearable && "mb-1", className)}
      {...props}
    />
  );

  if (!clearable) return input;

  return (
    <div className="relative [&>input]:pr-10 w-auto mb-1">
      {input}
      <div className="absolute right-2.5 bottom-0 flex h-9 items-center gap-1">
        <MenuClear />
      </div>
    </div>
  );
}

function MenuArrow(props: MenuPrimitive.Arrow.Props) {
  return (
    <MenuPrimitive.Arrow
      data-slot="menu-arrow"
      render={<PopupArrow border={2} />}
      {...props}
    />
  );
}

function MenuList({ className, ...props }: MenuPrimitive.List.Props) {
  return (
    <MenuPrimitive.List
      data-slot="menu-list"
      className={cn(
        "relative py-1 scroll-py-6 max-h-(--available-height) data-empty:hidden",
        "[&>[data-filter-section]:not([hidden])~[data-filter-section]:not([hidden])>[data-filter-separator]]:block",
        className,
      )}
      {...props}
    />
  );
}

function MenuEmpty({ className, ...props }: MenuPrimitive.Empty.Props) {
  return (
    <MenuPrimitive.Empty
      data-slot="menu-empty"
      className={cn(
        "text-center text-sm text-muted-foreground empty:m-0 empty:p-0 my-2",
        className,
      )}
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
    <MenuPrimitive.GroupLabel
      data-slot="menu-group-label"
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenuItem({
  variant = "default",
  className,
  ...props
}: MenuPrimitive.Item.Props & VariantProps<typeof menuItemVariants>) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(menuItemVariants({ variant }), className)}
      {...props}
    />
  );
}

function MenuLinkItem(props: MenuPrimitive.LinkItem.Props) {
  return <MenuPrimitive.LinkItem data-slot="menu-link-item" {...props} />;
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("my-1 h-px bg-border last:hidden", className)}
      {...props}
    />
  );
}

function MenuCheckboxItem({
  children,
  variant = "default",
  checked,
  className,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  variant?: Exclude<
    VariantProps<typeof menuCheckboxItemVariants>["variant"],
    "switch"
  >;
}) {
  const isSolid = variant === "solid";

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(menuCheckboxItemVariants({ variant }), className)}
      checked={checked}
      {...props}
    >
      {isSolid ? (
        <>
          <span className="col-start-1">{children}</span>

          <MenuPrimitive.CheckboxItemIndicator
            data-slot="menu-checkbox-indicator"
            className={cn(
              "inline-flex h-(--checkbox-size) w-(--checkbox-size) [--checkbox-size:--spacing(4.5)] shrink-0 items-center rounded-sm p-px outline-none",
              "border data-unchecked:bg-transparent data-checked:bg-primary",
            )}
            keepMounted
          >
            <Check
              data-slot="menu-checkbox-icon"
              className="in-data-unchecked:hidden size-3.5 text-primary-foreground place-content-center"
            />
          </MenuPrimitive.CheckboxItemIndicator>
        </>
      ) : (
        <>
          <MenuPrimitive.CheckboxItemIndicator
            data-slot="menu-checkbox-indicator"
            className="col-start-1 -ms-0.5"
          >
            <Check className="size-4" />
          </MenuPrimitive.CheckboxItemIndicator>

          <span className="col-start-2">{children}</span>
        </>
      )}
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuSwitchItem({
  children,
  className,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-switch-item"
      className={cn(menuCheckboxItemVariants({ variant: "switch" }), className)}
      {...props}
    >
      <span className="col-start-1">{children}</span>

      <MenuPrimitive.CheckboxItemIndicator
        data-slot="menu-switch-indicator"
        keepMounted
        className={cn(
          "inline-flex h-[calc(var(--thumb-size)+2px)]",
          "w-[calc(var(--thumb-size)*2-2px)]",
          "[--thumb-size:--spacing(3.5)]",
          "shrink-0 items-center rounded-full p-px",
          "data-checked:bg-primary data-unchecked:bg-accent",
          "transition-[background-color,box-shadow] duration-200",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block aspect-square h-full",
            "origin-left rounded-(--thumb-size)",
            "in-data-unchecked:bg-background",
            "dark:in-data-unchecked:bg-foreground",
            "in-data-checked:bg-primary-foreground",
            "transition-transform",
            "in-data-checked:translate-x-[calc(85%-2px)]",
            "in-data-unchecked:translate-x-0",
          )}
        />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

function MenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({
  children,
  className,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2",
        "rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none",
        "data-highlighted:bg-accent/70 data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator data-slot="menu-radio-indicator">
          <span className="size-2 rounded-full bg-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>

      {children}
    </MenuPrimitive.RadioItem>
  );
}

function MenuSubmenu(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot {...props} />;
}

function MenuSubmenuTrigger({
  children,
  className,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      className={cn(
        "relative flex cursor-default justify-between items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",

        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",

        "data-highlighted:relative data-highlighted:z-0",
        "data-highlighted:text-accent-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground",
        "data-highlighted:before:absolute data-highlighted:before:inset-0",
        "data-highlighted:before:rounded-sm",
        "data-highlighted:before:bg-accent/70",
        "data-highlighted:before:-z-10",

        "data-popup-open:relative data-popup-open:z-0",
        "data-popup-open:before:absolute data-popup-open:before:inset-0",
        "data-popup-open:before:rounded-sm",
        "data-popup-open:before:bg-accent",
        "data-popup-open:before:-z-10",

        "data-highlighted:data-popup-open:before:bg-accent",

        className,
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.SubmenuTrigger>
  );
}

function MenuShortcut(props: React.ComponentProps<typeof Shortcut>) {
  return <Shortcut data-slot="menu-shortcut" {...props} />;
}

const useMenuFilter: typeof MenuPrimitive.useFilter = MenuPrimitive.useFilter;

const MenuExports = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Input: MenuInput,
  Clear: MenuClear,
  Empty: MenuEmpty,
  List: MenuList,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  SwitchItem: MenuSwitchItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
  Shortcut: MenuShortcut,
});

export {
  MenuExports as Menu,
  MenuTrigger,
  MenuPopup,
  MenuArrow,
  MenuInput,
  MenuClear,
  MenuEmpty,
  MenuList,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuSeparator,
  MenuCheckboxItem,
  MenuSwitchItem,
  MenuRadioItem,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuShortcut,
  MenuCreateHandle,
  useMenuFilter,
};
