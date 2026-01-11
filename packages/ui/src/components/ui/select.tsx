import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckIcon, type LucideIcon } from "lucide-react";

/* ------------------------------ Root Select ------------------------------ */

function SelectRoot(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

/* ------------------------------ Select Value ------------------------------ */

function SelectValue(
  props: React.ComponentProps<typeof SelectPrimitive.Value>
) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

/* ------------------------------ Select Trigger ------------------------------ */

type SelectTriggerProps = React.ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  children?: React.ReactNode;
  valueProps?: React.ComponentProps<typeof SelectPrimitive.Value>;
};

function SelectTrigger({
  className,
  children,
  valueProps,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 min-w-36 items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-sm bg-secondary text-foreground select-none hover:bg-accent data-popup-open:bg-accent outline-none state-focus-ring",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

/* ------------------------------ Select Icon ------------------------------ */

type SelectIconProps = React.ComponentProps<typeof SelectPrimitive.Icon> & {
  icon?: LucideIcon;
};

function SelectIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: SelectIconProps) {
  return (
    <SelectPrimitive.Icon
      data-slot="select-icon"
      className={cn("flex", className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </SelectPrimitive.Icon>
  );
}

/* ------------------------------ Select Popup ------------------------------ */

type SelectPopupProps = React.ComponentProps<typeof SelectPrimitive.Popup> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof SelectPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<typeof SelectPrimitive.Positioner>;
  showScrollUp?: boolean;
  showScrollDown?: boolean;
  scrollUpProps?: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>;
  scrollDownProps?: React.ComponentProps<
    typeof SelectPrimitive.ScrollDownArrow
  >;
};

function SelectPopup({
  className,
  backdrop = false,
  backdropProps,
  positionerProps,
  showScrollUp = true,
  showScrollDown = true,
  scrollUpProps,
  scrollDownProps,
  ...props
}: SelectPopupProps) {
  return (
    <SelectPrimitive.Portal data-slot="select-portal">
      {backdrop && (
        <SelectPrimitive.Backdrop
          data-slot="select-backdrop"
          {...backdropProps}
        />
      )}
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        className={cn(
          "outline-none select-none z-10",
          positionerProps?.className
        )}
        {...positionerProps}
      >
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            "border group min-w-(--anchor-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-foreground shadow-md",
            "transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-ending-style:transition-none data-starting-style:scale-90 data-starting-style:opacity-0 data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
            className
          )}
          {...props}
        >
          {showScrollUp && (
            <SelectPrimitive.ScrollUpArrow
              data-slot="select-scroll-up-arrow"
              className={cn(
                "top-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-foreground text-center text-xs before:absolute data-[side=none]:before:-top-full before:left-0 before:h-full before:w-full before:content-['']",
                scrollUpProps?.className
              )}
              {...scrollUpProps}
            />
          )}
          {props.children}
          {showScrollDown && (
            <SelectPrimitive.ScrollDownArrow
              data-slot="select-scroll-down-arrow"
              className={cn(
                "bottom-0 z-1 flex h-4 w-full cursor-default items-center justify-center rounded-md bg-foreground text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:-bottom-full",
                scrollDownProps?.className
              )}
              {...scrollDownProps}
            />
          )}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

/* ------------------------------ Select List ------------------------------ */

function SelectList({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.List>) {
  return (
    <SelectPrimitive.List
      data-slot="select-list"
      className={cn(
        "relative py-1 scroll-py-6 overflow-y-auto max-h-(--available-height)",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Select Item ------------------------------ */

function SelectItem({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-highlighted:relative data-highlighted:text-primary-foreground data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-primary/80 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Select Item Indicator ------------------------------ */

function SelectItemIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemIndicator>) {
  return (
    <SelectPrimitive.ItemIndicator
      data-slot="select-item-indicator"
      className={cn("col-start-1", className)}
      {...props}
    >
      {children ?? <CheckIcon className="h-4 w-4" />}
    </SelectPrimitive.ItemIndicator>
  );
}

/* ------------------------------ Select Separator ------------------------------ */

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/* ------------------------------ Select Item Text ------------------------------ */

function SelectItemText({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemText>) {
  return (
    <SelectPrimitive.ItemText
      data-slot="select-item-text"
      className={cn("col-start-2", className)}
      {...props}
    />
  );
}

/* ------------------------------ Select Group ------------------------------ */

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}

/* ------------------------------ Select Group Label ------------------------------ */

function SelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-group-label"
      className={cn(
        "px-2.5 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const SelectExports = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Separator: SelectSeparator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});

export {
  SelectExports as Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPopup,
  SelectList,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectGroup,
  SelectGroupLabel,
};
