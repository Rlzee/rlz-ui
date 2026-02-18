import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDown, XIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { InputProps } from "@/components/ui/input";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";

const ComboboxContext = React.createContext<{
  chipsRef: React.RefObject<Element | null> | null;
  multiple: boolean;
}>({
  chipsRef: null,
  multiple: false,
});

type ComboboxRootProps<
  ItemValue,
  Multiple extends boolean | undefined
> = Parameters<typeof ComboboxPrimitive.Root<ItemValue, Multiple>>[0];

function ComboboxRoot<ItemValue, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<ItemValue, Multiple>
) {
  const chipsRef = React.useRef<Element | null>(null);

  return (
    <ComboboxContext.Provider value={{ chipsRef, multiple: !!props.multiple }}>
      <ComboboxPrimitive.Root
        {...(props as ComboboxRootProps<ItemValue, Multiple>)}
      />
    </ComboboxContext.Provider>
  );
}

type ComboboxTriggerProps = ComboboxPrimitive.Trigger.Props & {
  size?: Omit<
    ButtonProps["size"],
    "icon-xs" | "icon-sm" | "icon-md" | "icon-lg" | "icon-xl"
  >;
};

function ComboboxTrigger({
  size = "md",
  className,
  ...props
}: ComboboxTriggerProps) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        buttonVariants({ size } as ComboboxTriggerProps["size"]),
        "group border bg-secondary min-w-0 rounded-md text-foreground flex items-center justify-between gap-3 text-sm px-3",
        "data-popup-open:bg-accent hover:bg-accent",
        "outline-none state-focus-ring",
        className
      )}
      {...props}
    />
  );
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
      <XIcon className="h-3.5 w-3.5" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  variant = "default",
  className,
  ...props
}: ComboboxPrimitive.Input.Props & {
  variant?: InputProps["variant"];
}) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      data-variant={variant}
      className={cn(
        "data-[variant=default]:bg-input data-[variant=background]:bg-background data-[variant=accent]:bg-accent",
        "border h-9 outline-none w-full px-3 text-sm placeholder:text-muted-foreground rounded-md",
        className
      )}
      {...props}
    />
  );
}

function ComboboxIcon({
  className,
  icon: Icon = ChevronDown,
  ...props
}: ComboboxPrimitive.Icon.Props & {
  icon?: LucideIcon;
}) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn(
        "flex text-muted-foreground group-hover:text-foreground hover:text-foreground group-data-popup-open:text-foreground",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </ComboboxPrimitive.Icon>
  );
}

function ComboboxField({
  variant = "default",
  placeholder,
  clearable,
  icon,
  className,
}: {
  placeholder?: string;
  clearable?: boolean;
  icon?: LucideIcon;
  className?: string;
  variant?: InputProps["variant"];
}) {
  return (
    <div
      data-slot="combobox-field"
      className={cn(
        "relative [&>input]:pr-10 has-[data-slot=combobox-clear]:[&>input]:pr-16",
        className
      )}
    >
      <ComboboxInput
        variant={variant}
        className="focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring"
        placeholder={placeholder}
      />

      <div className="absolute right-3 bottom-0 flex h-9 items-center gap-1">
        <ComboboxPrimitive.Trigger className="group has-[+[data-slot=combobox-clear]]:hidden">
          <ComboboxIcon icon={icon} />
        </ComboboxPrimitive.Trigger>
        {clearable && <ComboboxClear />}
      </div>
    </div>
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
    sideOffset = 4,
    className: positionerClassName,
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
        anchor={chipsRef}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-popup"
          className={cn(
            "border group w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) bg-clip-padding rounded-md bg-popover text-popover-foreground shadow-md",
            "data-open:animate-in data-ending-style:animate-out data-ending-style:fade-out-0 data-open:fade-in-0 data-ending-style:zoom-out-95 data-open:zoom-in-95",
            "has-data-[slot=combobox-input]:p-2 [&_input]:mb-2",
            className
          )}
          {...props}
        ></ComboboxPrimitive.Popup>
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
        "grid cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none",
        "pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem]",
        "group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4",
        "hover:relative hover:text-primary-foreground hover:z-0 hover:before:absolute hover:before:inset-x-1 hover:before:inset-y-0 hover:before:z-[-1] hover:before:rounded-sm hover:before:bg-primary/80",
        "data-highlighted:relative data-highlighted:text-primary-foreground data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm data-highlighted:before:bg-primary/80",
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
      {children ?? <CheckIcon className="h-4 w-4" />}
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
      className={cn("my-1 h-px bg-border", className)}
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
        "pl-7.5 py-1.5 text-sm font-medium text-muted-foreground",
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
        "flex flex-wrap items-center gap-0.5 rounded-md border w-64 bg-secondary text-foreground outline-none min-h-9",
        "[&_input]:border-0 [&_input]:focus-within:ring-0 [&_input]:h-7 [&_input]:flex-1",
        "focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring",
        "has-data-[slot=combobox-chip]:px-1 has-data-[slot=combobox-chip]:py-0.5",
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
        "flex items-center gap-1 rounded-md bg-accent px-1.5 py-[0.2rem] text-sm text-secondary-foreground outline-none cursor-default h-[calc(--spacing(5.25))]",
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
      className={cn("cursor-pointer", className)}
      {...props}
    >
      <XIcon className="h-4 w-4" />
    </ComboboxPrimitive.ChipRemove>
  );
}

export const ComboboxFilter = ComboboxPrimitive.useFilter;

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
