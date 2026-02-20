import * as React from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Input, type InputProps } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";
import { ChevronDown as ChevronDownIcon, X as XIcon } from "lucide-react";

const AutocompleteRoot = AutocompletePrimitive.Root;

function AutocompleteTrigger({
  className,
  ...props
}: AutocompletePrimitive.Trigger.Props) {
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

function AutocompleteInput({
  variant,
  unstyled = false,
  clearable = false,
  className,
  ...props
}: AutocompletePrimitive.Input.Props & {
  variant?: InputProps["variant"];
  unstyled?: InputProps["unstyled"];
  clearable?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  if (clearable) {
    return (
      <div className="relative [&>input]:pr-10 w-full">
        <AutocompletePrimitive.Input
          data-slot="autocomplete-input"
          render={
            <Input
              nativeInput
              variant={variant}
              unstyled={unstyled}
              className="w-full"
            />
          }
          className={cn("h-9", "data-popup-open:bg-secondary", className)}
          {...props}
        />

        <div className="absolute right-3 bottom-0 flex h-9 items-center gap-1">
          {clearable && <AutocompleteClear />}
        </div>
      </div>
    );
  }

  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      render={
        <Input
          nativeInput
          variant={variant}
          unstyled={unstyled}
          className="w-full"
        />
      }
      className={cn("h-9", "data-popup-open:bg-secondary", className)}
      {...props}
    />
  );
}

function AutocompleteValue(props: AutocompletePrimitive.Value.Props) {
  return <AutocompletePrimitive.Value {...props} />;
}

function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn(
        "cursor-pointer flex text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <XIcon className="h-3.5 w-3.5" />
    </AutocompletePrimitive.Clear>
  );
}

function AutocompleteIcon({
  className,
  icon: Icon = ChevronDownIcon,
  ...props
}: AutocompletePrimitive.Icon.Props & {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
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

function AutocompleteBackdrop({
  className,
  ...props
}: AutocompletePrimitive.Backdrop.Props) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot="autocomplete-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}

function AutocompletePositioner({
  className,
  ...props
}: AutocompletePrimitive.Positioner.Props) {
  return (
    <AutocompletePrimitive.Positioner
      data-slot="autocomplete-positioner"
      className={cn("outline-none select-none z-10", className)}
      {...props}
    />
  );
}

function AutocompletePopup({
  backdrop = false,
  backdropProps,
  positionerProps,
  className,
  ...props
}: AutocompletePrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof AutocompleteBackdrop>;
  positionerProps?: React.ComponentProps<typeof AutocompletePositioner>;
}) {
  const {
    sideOffset = 4,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <AutocompletePrimitive.Portal data-slot="autocomplete-portal">
      {backdrop && (
        <AutocompleteBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <AutocompletePositioner
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionerClassName}
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
      </AutocompletePositioner>
    </AutocompletePrimitive.Portal>
  );
}

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

function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
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

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
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

function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <ScrollArea scrollbarGutter scrollFade>
      <AutocompletePrimitive.List
        data-slot="autocomplete-list"
        className={cn(
          "relative py-1 scroll-py-6 max-h-(--available-height) data-empty:hidden",
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
}

function AutocompleteItem({
  className,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "flex cursor-default items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none",
        "group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4",
        "pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        "hover:before:absolute hover:text-primary-foreground hover:before:inset-x-1 hover:before:inset-y-0 hover:before:rounded-sm hover:before:z-[-1] hover:before:bg-primary/80",
        "data-highlighted:relative hover:relative data-highlighted:text-primary-foreground data-highlighted:z-0 hover:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-primary/80",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("my-1 h-px bg-border mx-2 last:hidden", className)}
      {...props}
    />
  );
}

function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("py-1", className)}
      {...props}
    />
  );
}

function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        "px-2.5 py-1.5 text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteRow(props: AutocompletePrimitive.Row.Props) {
  return <AutocompletePrimitive.Row {...props} />;
}

function AutocompleteCollection(props: AutocompletePrimitive.Collection.Props) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

/* eslint-disable react-refresh/only-export-components */
export const useAutocompleteFilter = AutocompletePrimitive.useFilter;

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
