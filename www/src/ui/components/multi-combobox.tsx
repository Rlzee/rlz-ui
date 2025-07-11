"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { ComponentProps } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command } from "./command";
import { Popover } from "./popover";
import { Button } from "./button";
import { cn } from "@/src/lib/utils";
import { Combobox } from "./combobox";
import { Checkbox } from "./checkbox";

/* ------------------------------ Multi Combobox Context ------------------------------ */

interface MultiComboboxContextValue<T> {
  isOpen: boolean;
  toggleOpen: () => void;
  close: () => void;
  selected: T[];
  setselected: (items: T[]) => void;
  filter: string;
  setFilter: (value: string) => void;
  toggleItem: (item: T) => void;
  isselected: (item: T) => boolean;
}

const MultiComboboxContext = createContext<MultiComboboxContextValue<any> | undefined>(undefined);

function useMultiComboboxContext<T>() {
  const context = useContext(MultiComboboxContext) as MultiComboboxContextValue<T> | undefined;
  if (!context) {
    throw new Error("MultiCombobox components must be used within a MultiComboboxProvider");
  }
  return context;
}

/* ------------------------------ Root Multi Combobox ------------------------------ */

interface MultiComboboxProps<T> extends ComponentProps<typeof Popover> {
  children: ReactNode;
  defaultselected?: T[];
  onChange?: (items: T[]) => void;
}

function MultiCombobox<T>({
  children,
  defaultselected = [],
  onChange,
  ...props
}: MultiComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setselected] = useState<T[]>(defaultselected);
  const [filter, setFilter] = useState("");

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  const toggleItem = useCallback(
    (item: T) => {
      setselected((prev) => {
        if (prev.includes(item)) {
          return prev.filter((i) => i !== item);
        } else {
          return [...prev, item];
        }
      });
    },
    [setselected]
  );

  const isselected = useCallback(
    (item: T) => selected.includes(item),
    [selected]
  );

  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);

  return (
    <MultiComboboxContext.Provider
      value={{
        isOpen,
        toggleOpen,
        close,
        selected,
        setselected,
        filter,
        setFilter,
        toggleItem,
        isselected,
      }}
    >
      <Popover {...props} open={isOpen} onOpenChange={setIsOpen} data-slot="multiCombobox">
        {children}
      </Popover>
    </MultiComboboxContext.Provider>
  );
}

/* ------------------------------ Multi Combobox Trigger ------------------------------ */

const MultiComboboxTrigger = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Popover.Trigger>) => {
  const { toggleOpen } = useMultiComboboxContext();
  return (
    <Popover.Trigger
      asChild
      {...props}
      data-slot="multiCombobox-trigger"
      onClick={(e) => {
        e.stopPropagation();
        toggleOpen();
      }}
      className={className}
    >
      {children}
    </Popover.Trigger>
  );
};

/* ------------------------------ Multi Combobox Trigger Button ------------------------------ */

interface MultiComboboxTriggerButtonProps extends ComponentProps<typeof Button> {
  placeholder?: string;
}

const MultiComboboxTriggerButton = ({
  placeholder = "Combobox options",
  className,
  ...props
}: MultiComboboxTriggerButtonProps) => {
  const { selected } = useMultiComboboxContext<any>();

  const icon = <ChevronsUpDown className="opacity-50" />;

  const label =
    selected.length === 0 ? placeholder : selected.join(", ");

  return (
    <Button
      role="combobox"
      aria-multiselectable="true"
      className={cn("w-[200px] justify-between", className)}
      data-slot="multiCombobox-trigger-button"
      variant="outline"
      {...props}
    >
      <span className="text-left truncate">{label}</span>
      {icon}
    </Button>
  );
};

/* ------------------------------ Multi Combobox Content ------------------------------ */

const MultiComboboxContent = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Popover.Content>) => {
  return (
    <Popover.Content
      className={cn("w-[200px] p-0", className)}
      {...props}
      data-slot="multiCombobox-content"
    >
      <Command>{children}</Command>
    </Popover.Content>
  );
};

/* ------------------------------ Multi Combobox Input ------------------------------ */

interface MultiComboboxInputProps {
  className?: string;
  placeholder?: string;
}

const MultiComboboxInput = ({ className, placeholder = "Search..." }: MultiComboboxInputProps) => {
  const { filter, setFilter } = useMultiComboboxContext<any>();

  return (
    <Command.Input
      className={cn("h-9", className)}
      data-slot="multiCombobox-input"
      placeholder={placeholder}
      value={filter}
      onValueChange={setFilter}
      kbd={false}
    />
  );
};

/* ------------------------------ Multi Combobox List ------------------------------ */

const MultiComboboxList = ({ ...props }: ComponentProps<typeof Combobox.List>) => {
  return <Combobox.List {...props} data-slot="multiCombobox-list" />;
}

/* ------------------------------ Multi Combobox Group ------------------------------ */

const MultiComboboxGroup = ({ ...props }: ComponentProps<typeof Combobox.Group>) => {
  return <Combobox.Group {...props} data-slot="multiCombobox-group" />;
}

/* ------------------------------ Multi Combobox Item ------------------------------ */

interface MultiComboboxItemProps extends ComponentProps<typeof Command.Item> {
  value: any;
  children: ReactNode;
}

const MultiComboboxItem = ({ children, className, value, ...props }: MultiComboboxItemProps) => {
  const { toggleItem, isselected } = useMultiComboboxContext<any>();

  const selected = isselected(value);

  const onCombobox = () => {
    toggleItem(value);
  };

  return (
    <Command.Item
      className={className}
      {...props}
      data-slot="multiCombobox-item"
      onSelect={onCombobox}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={() => toggleItem(value)}
        className="mr-2"
        data-slot="multiCombobox-item-checkbox"
      />
      {children}
    </Command.Item>
  );
};

/* ------------------------------ Multi Combobox Separator ------------------------------ */

const MultiComboboxSeparator = () => {
  return <Combobox.Separator data-slot="multiCombobox-separator" />;
};

/* ------------------------------ Multi Combobox Label ------------------------------ */

const MultiComboboxLabel = ({ ...props}: ComponentProps<typeof Combobox.Label>) => {
  return <Combobox.Label {...props} data-slot="multiCombobox-label" />;
}

/* ------------------------------ Exports ------------------------------ */

const MultiComboboxComposed = Object.assign(MultiCombobox, {
  Trigger: MultiComboboxTrigger,
  TriggerButton: MultiComboboxTriggerButton,
  Content: MultiComboboxContent,
  Input: MultiComboboxInput,
  List: MultiComboboxList,
  Group: MultiComboboxGroup,
  Item: MultiComboboxItem,
  Separator: MultiComboboxSeparator,
  Label: MultiComboboxLabel,
});

export {
  MultiComboboxComposed as MultiCombobox,
  MultiComboboxTrigger,
  MultiComboboxTriggerButton,
  MultiComboboxContent,
  MultiComboboxInput,
  MultiComboboxList,
  MultiComboboxGroup,
  MultiComboboxItem,
  MultiComboboxSeparator,
  MultiComboboxLabel,
};
