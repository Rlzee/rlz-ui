"use client";

import type * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { type ButtonProps, buttonVariants } from "@rlz/ui/components/ui/button";
import { cn } from "@rlz/ui/lib/cn";
import { ChevronDown, Check } from "lucide-react";

const SelectRoot = SelectPrimitive.Root;

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: Omit<
    ButtonProps["size"],
    "icon-xs" | "icon-sm" | "icon-md" | "icon-lg" | "icon-xl"
  >;
};

function SelectTrigger({
  size = "md",
  className,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        buttonVariants({ size } as SelectTriggerProps["size"]),
        "relative inline-flex w-full min-w-36 select-none items-center justify-between gap-2 rounded-md border bg-popover not-dark:bg-clip-padding text-left text-sm text-foreground outline-none",
        "hover:bg-accent/70 data-popup-open:bg-accent data-popup-open:text-muted-foreground",
        "state-focus-ring",
        className
      )}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn(
        "truncate data-placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SelectIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: SelectPrimitive.Icon.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <SelectPrimitive.Icon
      data-slot="select-icon"
      className={cn("text-muted", className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </SelectPrimitive.Icon>
  );
}

function SelectBackdrop({
  className,
  ...props
}: SelectPrimitive.Backdrop.Props) {
  return (
    <SelectPrimitive.Backdrop
      data-slot="select-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}

function SelectPositioner({
  className,
  ...props
}: SelectPrimitive.Positioner.Props) {
  return (
    <SelectPrimitive.Positioner
      data-slot="select-positioner"
      className={cn("outline-none select-none z-10", className)}
      {...props}
    />
  );
}

function SelectScrollUpArrow({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-arrow"
      className={cn(
        "top-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-foreground text-center text-xs before:absolute data-[side=none]:before:-top-full before:left-0 before:h-full before:w-full before:content-['']",
        className
      )}
      {...props}
    />
  );
}

function SelectScrollDownArrow({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-arrow"
      className={cn(
        "bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-foreground text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-bottom-full",
        className
      )}
      {...props}
    />
  );
}

function SelectPortal(props: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />;
}

type SelectPopupProps = SelectPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof SelectBackdrop>;
  scrollUp?: boolean;
  scrollDown?: boolean;
  scrollUpProps?: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>;
  scrollDownProps?: React.ComponentProps<
    typeof SelectPrimitive.ScrollDownArrow
  >;
  positionerProps?: React.ComponentProps<typeof SelectPositioner>;
};

function SelectPopup({
  className,
  backdrop = false,
  backdropProps,
  positionerProps,
  children,
  ...props
}: SelectPopupProps) {
  const {
    sideOffset = 4,
    side = "bottom",
    align = "start",
    alignOffset = 0,
    alignItemWithTrigger = true,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <SelectPortal>
      {backdrop && (
        <SelectBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <SelectPositioner
        {...restPositionerProps}
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        side={side}
        className={positionerClassName}
      >
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            "border group w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPositioner>
    </SelectPortal>
  );
}

function SelectList({ className, ...props }: SelectPrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <SelectPrimitive.List
        data-slot="select-list"
        className={cn(
          "relative py-1 scroll-py-6 max-h-(--available-height)",
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
}

function SelectItem({ className, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "has-data-[slot=select-item-indicator]:grid has-data-[slot=select-item-indicator]:grid-cols-[0.75rem_1fr]",
        "flex cursor-default items-center gap-3 py-2 pl-3 text-sm leading-4 outline-none select-none",
        "pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        "hover:relative hover:text-accent-foreground hover:z-0 hover:before:absolute hover:before:inset-x-1 hover:before:inset-y-0 hover:before:z-[-1] hover:before:rounded-sm hover:before:bg-accent/70",
        "data-highlighted:relative data-highlighted:text-accent-foreground data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-accent/70",
        className
      )}
      {...props}
    />
  );
}

function SelectItemText({
  className,
  ...props
}: SelectPrimitive.ItemText.Props) {
  return (
    <SelectPrimitive.ItemText
      data-slot="select-item-text"
      className={cn("col-start-2 order-last", className)}
      {...props}
    />
  );
}

function SelectItemIndicator({
  children,
  className,
  ...props
}: SelectPrimitive.ItemIndicator.Props) {
  return (
    <SelectPrimitive.ItemIndicator
      data-slot="select-item-indicator"
      keepMounted
      className={cn(
        "col-start-1 order-first invisible data-selected:visible",
        className
      )}
      {...props}
    >
      {children ?? <Check className="h-4 w-4" />}
    </SelectPrimitive.ItemIndicator>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-border mx-2 last:hidden", className)}
      {...props}
    />
  );
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}

function SelectGroupLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-group-label"
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

const SelectExports = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  ScrollUp: SelectScrollUpArrow,
  ScrollDown: SelectScrollDownArrow,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Separator: SelectSeparator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});

export {
  SelectExports as Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectPositioner,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
};
