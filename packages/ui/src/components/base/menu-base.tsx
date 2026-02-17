import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

type BaseComponentProps<T extends React.ElementType> = {
  baseComponent: T;
  className?: React.ComponentProps<T>["className"];
} & Omit<React.ComponentProps<T>, "className">;

type MenuPopupBaseProps<
  TPortal extends React.ElementType,
  TPopup extends React.ElementType,
  TBackdrop extends React.ElementType,
  TPositioner extends React.ElementType
> = React.ComponentProps<TPopup> & {
  portalC: TPortal;
  popupC: TPopup;
  backdropC?: TBackdrop;
  positionerC: TPositioner;

  backdrop?: boolean;
  backdropProps?: React.ComponentProps<TBackdrop>;
  positionerProps?: React.ComponentProps<TPositioner>;
  className?: React.ComponentProps<TPopup>["className"];
};

function MenuPopupBase<
  TPortal extends React.ElementType,
  TPopup extends React.ElementType,
  TBackdrop extends React.ElementType,
  TPositioner extends React.ElementType
>({
  portalC: Portal,
  popupC: Popup,
  backdropC: Backdrop,
  positionerC: Positioner,
  backdrop,
  backdropProps,
  positionerProps,
  className,
  ...props
}: MenuPopupBaseProps<TPortal, TPopup, TBackdrop, TPositioner>) {
  const {
    sideOffset = 8,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <Portal data-slot="menu-portal">
      {backdrop && Backdrop && (
        <Backdrop data-slot="menu-backdrop" {...backdropProps} />
      )}
      <Positioner
        data-slot="menu-positioner"
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <Popup
          data-slot="menu-popup"
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-32 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2",
            className
          )}
          {...props}
        />
      </Positioner>
    </Portal>
  );
}

function MenuGroupLabelBase({
  baseComponent: Component,
  className,
  ...props
}: BaseComponentProps<React.ElementType>) {
  return (
    <Component
      data-slot="menu-group-label"
      className={cn(
        "px-2 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function MenuItemBase({
  baseComponent: Component,
  className,
  ...props
}: BaseComponentProps<React.ElementType>) {
  return (
    <Component
      data-slot="menu-item"
      className={cn(
        "group/menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",

        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",

        "data-highlighted:relative data-highlighted:z-0",
        "data-highlighted:text-primary-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-primary-foreground",
        "data-highlighted:before:absolute data-highlighted:before:inset-0",
        "data-highlighted:before:rounded-sm",
        "data-highlighted:before:bg-primary/80",
        "data-highlighted:before:-z-10",

        className
      )}
      {...props}
    />
  );
}

function MenuSeparatorBase({
  baseComponent: Component,
  className,
  ...props
}: BaseComponentProps<React.ElementType>) {
  return (
    <Component
      data-slot="menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

type MenuCheckboxItemBaseProps<
  TItem extends React.ElementType,
  TIndicator extends React.ElementType
> = React.ComponentProps<TItem> & {
  itemC: TItem;
  indicatorC: TIndicator;
};

function MenuCheckboxItemBase<
  TItem extends React.ElementType,
  TIndicator extends React.ElementType
>({
  itemC: Item,
  indicatorC: Indicator,
  className,
  checked,
  children,
  ...props
}: MenuCheckboxItemBaseProps<TItem, TIndicator>) {
  return (
    <Item
      data-slot="menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <Indicator>
          <CheckIcon className="size-4" />
        </Indicator>
      </span>
      {children}
    </Item>
  );
}

function MenuSubmenuTriggerBase({
  baseComponent: Component,
  className,
  children,
  ...props
}: BaseComponentProps<React.ElementType>) {
  return (
    <Component
      data-slot="menu-submenu-trigger"
      className={cn(
        "relative flex cursor-default justify-between items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
        "data-disabled:pointer-events-none data-disabled:opacity-50",

        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",

        "data-highlighted:relative data-highlighted:z-0",
        "data-highlighted:text-primary-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-primary-foreground",
        "data-highlighted:before:absolute data-highlighted:before:inset-0",
        "data-highlighted:before:rounded-sm",
        "data-highlighted:before:bg-primary/80",
        "data-highlighted:before:-z-10",

        "data-popup-open:relative data-popup-open:z-0",
        "data-popup-open:before:absolute data-popup-open:before:inset-0",
        "data-popup-open:before:rounded-sm",
        "data-popup-open:before:bg-accent",
        "data-popup-open:before:-z-10",

        "data-highlighted:data-popup-open:before:bg-primary/80",

        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon />
    </Component>
  );
}

type MenuRadioItemBaseProps<
  TItem extends React.ElementType,
  TIndicator extends React.ElementType
> = React.ComponentProps<TItem> & {
  itemC: TItem;
  indicatorC: TIndicator;
};

function MenuRadioItemBase<
  TItem extends React.ElementType,
  TIndicator extends React.ElementType
>({
  itemC: Item,
  indicatorC: Indicator,
  className,
  children,
  ...props
}: MenuRadioItemBaseProps<TItem, TIndicator>) {
  return (
    <Item
      data-slot="menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <Indicator>
          <CircleIcon className="size-2 fill-current" />
        </Indicator>
      </span>
      {children}
    </Item>
  );
}

const MenuBase = {
  Popup: MenuPopupBase,
  GroupLabel: MenuGroupLabelBase,
  Item: MenuItemBase,
  Separator: MenuSeparatorBase,
  CheckboxItem: MenuCheckboxItemBase,
  SubmenuTrigger: MenuSubmenuTriggerBase,
  RadioItem: MenuRadioItemBase,
};

export {
  MenuBase,
  MenuPopupBase,
  MenuGroupLabelBase,
  MenuItemBase,
  MenuSeparatorBase,
  MenuCheckboxItemBase,
  MenuSubmenuTriggerBase,
  MenuRadioItemBase,
};
