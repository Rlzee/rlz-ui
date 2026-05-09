"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { ScrollArea } from "@rlz/ui/components/ui/scroll-area";
import { Input, type InputProps } from "@rlz/ui/components/ui/input";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@rlz/ui/components/base/popup-arrow";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@rlz/ui/lib/cn";

export const ComboboxContext = React.createContext<{
  chipsRef: React.RefObject<Element | null> | null;
  multiple: boolean;
}>({
  chipsRef: null,
  multiple: false,
});

function ComboboxRoot<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>
): React.ReactElement {
  const chipsRef = React.useRef<Element | null>(null);
  return (
    <ComboboxContext.Provider value={{ chipsRef, multiple: !!props.multiple }}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxContext.Provider>
  );
}

function ComboboxTrigger(props: ComboboxPrimitive.Trigger.Props) {
  return <ComboboxPrimitive.Trigger data-slot="combobox-trigger" {...props} />;
}

function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "cursor-pointer flex text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <X className="h-3.5 w-3.5" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  variant,
  unstyled = false,
  className,
  ...props
}: ComboboxPrimitive.Input.Props & {
  variant?: InputProps["variant"];
  unstyled?: InputProps["unstyled"];
  clearable?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      render={
        <Input
          nativeInput
          variant={variant}
          unstyled={unstyled}
          className="w-full has-disabled:opacity-50"
        />
      }
      className={cn("h-9", "data-popup-open:bg-secondary", className)}
      {...props}
    />
  );
}

function ComboboxIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: ComboboxPrimitive.Icon.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn(
        "flex text-muted-foreground group-hover:text-foreground",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </ComboboxPrimitive.Icon>
  );
}

function ComboboxField({
  clearable = false,
  icon = ChevronDown,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxInput> & {
  clearable?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "relative [&>input]:pr-10 has-[data-slot=combobox-clear]:[&>input]:pr-16",
        "has-disabled:opacity-50",
        className
      )}
    >
      <ComboboxInput {...props} />

      <div className="absolute right-3 bottom-0 flex h-9 items-center gap-1">
        <ComboboxPrimitive.Trigger className="group has-[+[data-slot=combobox-clear]]:hidden">
          <ComboboxIcon icon={icon} />
        </ComboboxPrimitive.Trigger>
        {clearable && <ComboboxClear />}
      </div>
    </ComboboxPrimitive.InputGroup>
  );
}

function ComboboxBackdrop({
  className,
  ...props
}: ComboboxPrimitive.Backdrop.Props) {
  return (
    <ComboboxPrimitive.Backdrop
      data-slot="autocomplete-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}

function ComboboxPositioner({
  className,
  ...props
}: ComboboxPrimitive.Positioner.Props) {
  return (
    <ComboboxPrimitive.Positioner
      data-slot="combobox-positioner"
      className={cn("outline-none select-none z-10", className)}
      {...props}
    />
  );
}

function ComboboxPopup({
  children,
  backdrop,
  backdropProps,
  positionerProps,
  className,
  ...props
}: ComboboxPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof ComboboxBackdrop>;
  positionerProps?: React.ComponentProps<typeof ComboboxPositioner>;
}) {
  const { chipsRef } = React.useContext(ComboboxContext);

  const {
    sideOffset = 6,
    className: positionerClassName,
    anchor: positionerAnchor,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <ComboboxPrimitive.Portal data-slot="combobox-portal">
      {backdrop && (
        <ComboboxBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <ComboboxPositioner
        {...restPositionerProps}
        anchor={chipsRef?.current != null ? chipsRef : positionerAnchor}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-popup"
          className={cn(
            "border group w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-popover-foreground shadow-md",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "has-data-[slot=combobox-input]:p-2",
            className
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPositioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxArrow(props: ArrowType) {
  return (
    <PopupArrow
      border={2}
      baseComponent={ComboboxPrimitive.Arrow}
      data-slot="combobox-arrow"
      {...props}
    />
  );
}

function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        "text-center text-sm text-muted-foreground empty:hidden my-2",
        className
      )}
      {...props}
    />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-center text-sm text-muted-foreground empty:m-0 empty:p-0 my-2",
        className
      )}
      {...props}
    />
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <ComboboxPrimitive.List
        data-slot="combobox-list"
        className={cn(
          "relative py-1 scroll-py-6 max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] data-empty:hidden",
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
}

function ComboboxItem({ className, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2.5 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none",
        "pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        "group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4",
        "hover:relative hover:text-accent-foreground hover:z-0 hover:before:absolute hover:before:inset-x-1 hover:before:inset-y-0 hover:before:z-[-1] hover:before:rounded-sm hover:before:bg-accent/70",
        "data-highlighted:relative data-highlighted:text-accent-foreground data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-accent/70",
        className
      )}
      {...props}
    />
  );
}

function ComboboxIndicator({
  children,
  className,
  ...props
}: ComboboxPrimitive.ItemIndicator.Props) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      className={cn("col-start-1", className)}
      {...props}
    >
      {children ?? <Check className="h-4 w-4" />}
    </ComboboxPrimitive.ItemIndicator>
  );
}

function ComboboxItemText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="combobox-item-text"
      className={cn("col-start-2", className)}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("my-1 h-px bg-border mx-2 last:hidden", className)}
      {...props}
    />
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}

function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "px-2.5 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxRow(props: ComboboxPrimitive.Row.Props) {
  return <ComboboxPrimitive.Row data-slot="combobox-row" {...props} />;
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips>) {
  const { chipsRef } = React.useContext(ComboboxContext);

  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      ref={chipsRef as React.Ref<HTMLDivElement> | null}
      onMouseDown={(e) => {
        if (!chipsRef?.current) return;

        const target = e.target as HTMLElement;
        if (target.closest('[data-slot="combobox-chip"]')) return;

        e.preventDefault();

        const input = chipsRef.current.querySelector<HTMLInputElement>("input");
        if (input && document.activeElement !== input) {
          input.focus();
        }
      }}
      className={cn(
        "relative inline-flex min-h-9 w-full flex-wrap gap-1 rounded-md border bg-input text-sm p-[calc(--spacing(1)-1px)] outline-none *:min-h-7",
        "focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring",
        "has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive",
        "has-disabled:cursor-not-allowed has-disabled:pointer-events-none has-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function ComboboxChip({ className, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ComboboxChipRemove({
  className,
  ...props
}: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(
        "h-full shrink-0 cursor-pointer px-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <X />
    </ComboboxPrimitive.ChipRemove>
  );
}

function ComboboxChipsInput({
  variant = "default",
  className,
  ...props
}: ComboboxPrimitive.Input.Props & {
  variant?: InputProps["variant"];
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={cn(
        "min-w-12 flex-1 ps-3 outline-none [[data-slot=combobox-chip]+&]:ps-0.5",
        className
      )}
      {...props}
    />
  );
}

export const useComboboxFilter = ComboboxPrimitive.useFilter;

const ComboboxExports = Object.assign(ComboboxRoot, {
  Value: ComboboxValue,
  Input: ComboboxInput,
  Clear: ComboboxClear,
  Trigger: ComboboxTrigger,
  Field: ComboboxField,
  Icon: ComboboxIcon,
  Popup: ComboboxPopup,
  Arrow: ComboboxArrow,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  List: ComboboxList,
  Item: ComboboxItem,
  ItemText: ComboboxItemText,
  ItemIndicator: ComboboxIndicator,
  Separator: ComboboxSeparator,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Collection: ComboboxCollection,
  Row: ComboboxRow,
  Chips: ComboboxChips,
  ChipsInput: ComboboxChipsInput,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
});

export {
  ComboboxExports as Combobox,
  ComboboxArrow,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxSeparator,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxCollection,
  ComboboxRow,
  ComboboxIndicator,
  ComboboxValue,
  ComboboxClear,
  ComboboxIcon,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
};
