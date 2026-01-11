import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { CheckIcon, ChevronDown, XIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Combobox ------------------------------ */

function ComboboxRoot(
  props: React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Root>
) {
  return <ComboboxPrimitive.Root data-slot="combobox-root" {...props} />;
}

/* ------------------------------ Combobox Trigger ------------------------------ */

function ComboboxTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "flex h-9 min-w-36 items-center justify-between gap-3 rounded-md border pr-3 pl-3.5 text-sm bg-secondary text-foreground hover:bg-accent data-popup-open:bg-accent outline-none state-focus-ring",
        "has-[input]:hover:bg-secondary has-[input]:data-popup-open:bg-secondary has-[input]:focus-within:ring-ring/50 has-[input]:focus-within:ring-[3px] has-[input]:focus-within:border-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Value ------------------------------ */

function ComboboxValue(
  props: React.ComponentProps<typeof ComboboxPrimitive.Value>
) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

/* ------------------------------ Combobox Clear ------------------------------ */

function ComboboxClear({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <XIcon className="h-4 w-4" />
    </ComboboxPrimitive.Clear>
  );
}

/* ------------------------------ Combobox Input ------------------------------ */

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "flex h-9 w-full min-w-0 appearance-none bg-transparent outline-none placeholder:text-muted-foreground text-sm",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Icon ------------------------------ */

type ComboboxIconProps = React.ComponentProps<typeof ComboboxPrimitive.Icon> & {
  icon?: LucideIcon;
};

function ComboboxIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: ComboboxIconProps) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn("flex", className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </ComboboxPrimitive.Icon>
  );
}

/* ------------------------------ Combobox Popup ------------------------------ */

type ComboboxPopupProps = React.ComponentProps<
  typeof ComboboxPrimitive.Popup
> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof ComboboxPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<typeof ComboboxPrimitive.Positioner>;
};

function ComboboxPopup({
  backdrop,
  backdropProps,
  positionerProps = {
    sideOffset: 4,
  },
  className,
  ...props
}: ComboboxPopupProps) {
  return (
    <ComboboxPrimitive.Portal data-slot="combobox-portal">
      {backdrop && (
        <ComboboxPrimitive.Backdrop
          data-slot="combobox-backdrop"
          {...backdropProps}
        />
      )}
      <ComboboxPrimitive.Positioner
        data-slot="combobox-positioner"
        className={cn(
          "outline-none select-none z-10",
          positionerProps?.className
        )}
        anchor={positionerProps?.anchor}
        {...positionerProps}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-popup"
          className={cn(
            "border group w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-foreground shadow-md",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "**:data-[slot=combobox-input]:px-3 **:data-[slot=combobox-input]:border-b",
            className
          )}
          {...props}
        ></ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

/* ------------------------------ Combobox Arrow ------------------------------ */

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

/* ------------------------------ Combobox Status ------------------------------ */

function ComboboxStatus({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Status>) {
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

/* ------------------------------ Combobox Empty ------------------------------ */

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
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

/* ------------------------------ Combobox List ------------------------------ */

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "relative py-1 scroll-py-6 overflow-y-auto max-h-(--available-height) data-empty:hidden",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Item ------------------------------ */

function ComboboxItem({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-highlighted:relative hover:relative data-highlighted:text-primary-foreground hover:text-primary-foreground data-highlighted:z-0 hover:z-0 data-highlighted:before:absolute hover:before:absolute data-highlighted:before:inset-x-1 hover:before:inset-x-1 data-highlighted:before:inset-y-0 hover:before:inset-y-0 data-highlighted:before:z-[-1] hover:before:z-[-1] data-highlighted:before:rounded-sm hover:before:rounded-sm data-highlighted:before:bg-primary/80 hover:before:bg-primary/80 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Indicator ------------------------------ */

function ComboboxIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      className={cn("col-start-1", className)}
      {...props}
    >
      {children ?? <CheckIcon className="h-4 w-4" />}
    </ComboboxPrimitive.ItemIndicator>
  );
}

/* ------------------------------ Combobox Item Text ------------------------------ */

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

/* ------------------------------ Combobox Separator ------------------------------ */

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Group ------------------------------ */

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}
/* ------------------------------ Combobox Group Label ------------------------------ */

function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "pl-7.5 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Collection ------------------------------ */

function ComboboxCollection(
  props: React.ComponentProps<typeof ComboboxPrimitive.Collection>
) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

/* ------------------------------ Combobox Chips ------------------------------ */

function ComboboxChips({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex flex-wrap items-center gap-0.5 rounded-md border px-3 w-64 bg-secondary text-foreground outline-none",
        "focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring",
        "has-data-[slot=combobox-chip]:px-1 has-data-[slot=combobox-chip]:py-0.5",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Chip ------------------------------ */

function ComboboxChip({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex items-center gap-1 rounded-md bg-accent px-1.5 py-[0.2rem] text-sm text-secondary-foreground outline-none cursor-default",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Combobox Chip Remove ------------------------------ */

function ComboboxChipRemove({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ChipRemove>) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <XIcon className="h-4 w-4" />
    </ComboboxPrimitive.ChipRemove>
  );
}

/* ------------------------------ Exports ------------------------------ */

const ComboboxExports = Object.assign(ComboboxRoot, {
  Value: ComboboxValue,
  Input: ComboboxInput,
  Clear: ComboboxClear,
  Trigger: ComboboxTrigger,
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
  Chips: ComboboxChips,
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
