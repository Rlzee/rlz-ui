"use client";

import { ComponentProps } from "react";
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
import { Button } from "./button";

import { cn } from "@/src/lib/utils";

/* ------------------------------ Root Combobox ------------------------------ */

const Combobox = ({ children, ...props }: ComponentProps<typeof Popover>) => {
  return (
    <Popover {...props} data-slot="combobox">
      {children}
    </Popover>
  );
};

/* ------------------------------ Combobox Trigger ------------------------------ */

const ComboboxTrigger = ({
  children,
  className,
  ...props
}: ComponentProps<typeof PopoverTrigger>) => {
  return (
    <PopoverTrigger asChild {...props}>
      {children}
    </PopoverTrigger>
  );
};

/* ------------------------------ Combobox Trigger Button ------------------------------ */

interface ComboboxTriggerButtonProps extends ComponentProps<typeof Button> {
  placeholder?: string;
  chevronIcon?: "up" | "down" | "both";
}

const ComboboxTriggerButton = ({
  placeholder = "Select an option",
  chevronIcon = "both",
  ...props
}: ComboboxTriggerButtonProps) => {
  const icon =
    chevronIcon === "up" ? (
      <ChevronUp className="opacity-50" />
    ) : chevronIcon === "down" ? (
      <ChevronDown className="opacity-50" />
    ) : (
      <ChevronsUpDown className="opacity-50" />
    );

  return (
    <Button
      role="combobox"
      className={cn("w-[200px] justify-between", props.className)}
      data-slot="combobox-trigger-button"
      variant="secondary"
      {...props}
    >
      <span className="text-left">{placeholder}</span>
      {icon}
    </Button>
  );
};

/* ------------------------------ Combobox Content ------------------------------ */

const ComboboxContent = ({
  children,
  className,
  ...props
}: ComponentProps<typeof PopoverContent>) => {
  return (
    <PopoverContent className={cn("w-[200px] p-0", className)} {...props}>
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

interface ComboboxListProps extends ComponentProps<typeof CommandList> {
  placeholder?: string;
}

const ComboboxList = ({
  children,
  className,
  placeholder = "No results found",
  ...props
}: ComboboxListProps) => {
  return (
    <CommandList className={className} {...props}>
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
}: ComponentProps<typeof CommandGroup>) => {
  return (
    <CommandGroup className={className} {...props}>
      {children}
    </CommandGroup>
  );
};

/* ------------------------------ Combobox Item ------------------------------ */

const ComboboxItem = ({
  children,
  className,
  ...props
}: ComponentProps<typeof CommandItem>) => {
  return (
    <CommandItem className={className} {...props}>
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
  ComboboxTriggerButton,
};
