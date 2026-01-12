import * as React from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";
import { ChevronDown, XIcon, type LucideIcon } from "lucide-react";

/* ------------------------------ AutoComplete Root ------------------------------ */

function AutocompleteRoot(
  props: React.ComponentProps<typeof AutocompletePrimitive.Root>
) {
  return <AutocompletePrimitive.Root data-slot="autocomplete" {...props} />;
}

/* ------------------------------ AutoComplete Trigger ------------------------------ */

function AutocompleteTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Trigger>) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      className={cn(
        "border bg-secondary min-w-0 rounded-md text-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ AutoComplete Input ------------------------------ */

function AutocompleteInput({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Input>) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        "bg-secondary border h-9 outline-none w-full px-3 text-sm placeholder:text-muted-foreground rounded-md",
        "data-popup-open:bg-secondary focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Value ------------------------------ */

function AutocompleteValue(
  props: React.ComponentProps<typeof AutocompletePrimitive.Value>
) {
  return <AutocompletePrimitive.Value {...props} />;
}

/* ------------------------------ Autocomplete Clear ------------------------------ */

function AutocompleteClear({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Clear>) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <XIcon className="h-4 w-4" />
    </AutocompletePrimitive.Clear>
  );
}

/* ------------------------------ Autocomplete Icon ------------------------------ */

type AutocompleteIconProps = React.ComponentProps<
  typeof AutocompletePrimitive.Icon
> & {
  icon?: LucideIcon;
};

function AutocompleteIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: AutocompleteIconProps) {
  return (
    <AutocompletePrimitive.Icon
      data-slot="autocomplete-icon"
      className={cn("flex", className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </AutocompletePrimitive.Icon>
  );
}

/* ------------------------------ Autocomplete Popup ------------------------------ */

type AutocompletePopupProps = React.ComponentProps<
  typeof AutocompletePrimitive.Popup
> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof AutocompletePrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<
    typeof AutocompletePrimitive.Positioner
  >;
};

function AutocompletePopup({
  backdrop = false,
  backdropProps,
  positionerProps = {
    sideOffset: 4,
  },
  className,
  ...props
}: AutocompletePopupProps) {
  return (
    <AutocompletePrimitive.Portal data-slot="autocomplete-portal">
      {backdrop && (
        <AutocompletePrimitive.Backdrop
          data-slot="autocomplete-backdrop"
          {...backdropProps}
        />
      )}
      <AutocompletePrimitive.Positioner
        data-slot="autocomplete-positioner"
        className={cn(
          "outline-none select-none z-10",
          positionerProps?.className
        )}
        anchor={positionerProps?.anchor}
        {...positionerProps}
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-popup"
          className={cn(
            "border group w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-foreground shadow-md",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            className
          )}
          {...props}
        ></AutocompletePrimitive.Popup>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  );
}

/* ------------------------------ Autocomplete Arrow ------------------------------ */

function AutocompleteArrow(props: ArrowType) {
  return (
    <PopupArrow
      border={2}
      baseComponent={AutocompletePrimitive.Arrow}
      data-slot="autocomplete-arrow"
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Status ------------------------------ */

function AutocompleteStatus({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Status>) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn(
        "text-center text-sm text-muted-foreground empty:hidden my-2",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Empty ------------------------------ */

function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Empty>) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "text-center text-sm text-muted-foreground empty:m-0 empty:p-0 my-2",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete List ------------------------------ */

function AutocompleteList({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.List>) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn(
        "relative py-1 scroll-py-6 overflow-y-auto max-h-(--available-height) data-empty:hidden",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Item ------------------------------ */

function AutocompleteItem({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Item>) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-highlighted:relative hover:relative data-highlighted:text-primary-foreground hover:text-primary-foreground data-highlighted:z-0 hover:z-0 data-highlighted:before:absolute hover:before:absolute data-highlighted:before:inset-x-1 hover:before:inset-x-1 data-highlighted:before:inset-y-0 hover:before:inset-y-0 data-highlighted:before:z-[-1] hover:before:z-[-1] data-highlighted:before:rounded-sm hover:before:rounded-sm data-highlighted:before:bg-primary/80 hover:before:bg-primary/80 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Separator ------------------------------ */

function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Separator>) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Group ------------------------------ */

function AutocompleteGroup({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Group>) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}
/* ------------------------------ Autocomplete Group Label ------------------------------ */

function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "pl-7.5 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Autocomplete Row ------------------------------ */

function AutocompleteRow(
  props: React.ComponentProps<typeof AutocompletePrimitive.Row>
) {
  return <AutocompletePrimitive.Row {...props} />;
}

/* ------------------------------ Autocomplete Collection ------------------------------ */

function AutocompleteCollection(
  props: React.ComponentProps<typeof AutocompletePrimitive.Collection>
) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

/* ------------------------------ Exports ------------------------------ */

const AutocompleteExports = Object.assign(AutocompleteRoot, {
  Trigger: AutocompleteTrigger,
  Input: AutocompleteInput,
  Value: AutocompleteValue,
  Clear: AutocompleteClear,
  Icon: AutocompleteIcon,
  Popup: AutocompletePopup,
  Arrow: AutocompleteArrow,
  Status: AutocompleteStatus,
  Empty: AutocompleteEmpty,
  List: AutocompleteList,
  Item: AutocompleteItem,
  Separator: AutocompleteSeparator,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Row: AutocompleteRow,
  Collection: AutocompleteCollection,
});

export {
  AutocompleteExports as Autocomplete,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteValue,
  AutocompleteClear,
  AutocompleteIcon,
  AutocompletePopup,
  AutocompleteArrow,
  AutocompleteStatus,
  AutocompleteEmpty,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteSeparator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteRow,
  AutocompleteCollection,
};
