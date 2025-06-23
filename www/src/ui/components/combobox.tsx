"use client";

import * as React from "react";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/components/popover";
import { Button } from "@/src/ui/components/button";

import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Combobox ------------------------------ */

const Combobox = ({
  children,
  ...props
}: React.ComponentProps<typeof Popover>) => {
  return (
    <Popover {...props} data-slot="combobox">
      {children}
    </Popover>
  );
};

/* ------------------------------ Combobox Trigger ------------------------------ */

interface ComboboxTriggerProps
  extends React.ComponentProps<typeof PopoverTrigger> {
  chevronIcon?: "up" | "down" | "both";
  placeholder?: string;
}

const ComboboxTrigger = ({
  chevronIcon = "both",
  placeholder = "Select an option",
  ...props
}: ComboboxTriggerProps) => {
  const icon =
    chevronIcon === "up" ? (
      <ChevronUp className="opacity-50" />
    ) : chevronIcon === "down" ? (
      <ChevronDown className="opacity-50" />
    ) : (
      <ChevronsUpDown className="opacity-50" />
    );

  return (
    <PopoverTrigger {...props} asChild data-slot="combobox-trigger">
      <Button
        variant="secondary"
        role="combobox"
        className="w-[200px] justify-between"
      >
        <span className="text-left">{placeholder}</span>
        {icon}
      </Button>
    </PopoverTrigger>
  );
};

/* ------------------------------ Combobox Content ------------------------------ */

const ComboboxContent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) => {
  return (
    <PopoverContent className={cn("w-[200px] p-0", className)} {...props} data-slot="combobox-content">
      <Command>{children}</Command>
    </PopoverContent>
  );
};

/* ------------------------------ Combobox Input ------------------------------ */

interface ComboboxInputProps {
  className?: string;
  placeholder?: string;
}

const ComboboxInput = ({
  className,
  placeholder = "Search...",
}: ComboboxInputProps) => {
  return (
    <CommandInput
      className={cn("h-9", className)}
      data-slot="combobox-input"
      placeholder={placeholder}
      kbd={false} // No Esc shortcut in combobox
    />
  );
};

/* ------------------------------ Combobox List ------------------------------ */

interface ComboboxListProps extends React.ComponentProps<typeof CommandList> {
  placeholder?: string;
}

const ComboboxList = ({
  children,
  className,
  placeholder = "No results found",
  ...props
}: ComboboxListProps) => {
  return (
    <CommandList className={className} {...props} data-slot="combobox-list">
      <CommandEmpty>{placeholder}</CommandEmpty>
      {children}
    </CommandList>
  );
};

/* ------------------------------ Combobox Group ------------------------------ */

const ComboboxGroup = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CommandGroup>) => {
  return (
    <CommandGroup className={className} {...props} data-slot="combobox-group">
      {children}
    </CommandGroup>
  );
};

/* ------------------------------ Combobox Item ------------------------------ */

const ComboboxItem = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CommandItem>) => {
  return (
    <CommandItem className={className} {...props} data-slot="combobox-item">
      {children}
    </CommandItem>
  );
};

/* ------------------------------ Exports ------------------------------ */

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
};
