import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDown as ChevronDownIcon,
  Check as CheckIcon,
} from "lucide-react";

const SelectRoot = SelectPrimitive.Root;

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: Omit<
    ButtonProps["size"],
    "icon-xs" | "icon-sm" | "icon-md" | "icon-lg" | "icon-xl"
  >;
};

function SelectTrigger({
  size = "md",
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        buttonVariants({ size } as SelectTriggerProps["size"]),
        "group flex min-w-36 items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-sm bg-secondary text-foreground select-none hover:bg-accent data-popup-open:bg-accent outline-none",
        "state-focus-ring",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Trigger>
  );
}

function SelectIcon({
  className,
  icon: Icon = ChevronDownIcon,
  ...props
}: SelectPrimitive.Icon.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <SelectPrimitive.Icon
      data-slot="select-icon"
      className={cn(
        "flex text-muted-foreground group-hover:text-foreground hover:text-foreground group-data-popup-open:text-foreground",
        className
      )}
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
  scrollUp = true,
  scrollDown = true,
  scrollUpProps,
  scrollDownProps,
  children,
  ...props
}: SelectPopupProps) {
  return (
    <SelectPrimitive.Portal data-slot="select-portal">
      {backdrop && (
        <SelectBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <SelectPositioner
        className={positionerProps?.className}
        {...positionerProps}
      >
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            "border group min-w-(--anchor-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-popover-foreground shadow-md",
            "transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] data-[side=none]:data-ending-style:transition-none data-starting-style:scale-90 data-starting-style:opacity-0 data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none",
            className
          )}
          {...props}
        >
          {scrollUp && <SelectScrollUpArrow {...scrollUpProps} />}
          {children}
          {scrollDown && <SelectScrollDownArrow {...scrollDownProps} />}
        </SelectPrimitive.Popup>
      </SelectPositioner>
    </SelectPrimitive.Portal>
  );
}

function SelectList({ className, ...props }: SelectPrimitive.List.Props) {
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

function SelectItem({ className, ...props }: SelectPrimitive.Item.Props) {
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

function SelectItemIndicator({
  children,
  className,
  ...props
}: SelectPrimitive.ItemIndicator.Props) {
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

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-border", className)}
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
      className={cn("col-start-2", className)}
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
        "px-2.5 py-1.5 text-sm font-medium text-muted-foreground",
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
