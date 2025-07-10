"use client";

import { ComponentProps } from "react";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Command } from "@/src/ui/components/command";
import { Popover } from "@/src/ui/components/popover";
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
}: ComponentProps<typeof Popover.Trigger>) => {
  return (
    <Popover.Trigger asChild {...props} data-slot="combobox-trigger">
      {children}
    </Popover.Trigger>
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
      variant="outline"
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
}: ComponentProps<typeof Popover.Content>) => {
  return (
    <Popover.Content className={cn("w-[200px] p-0", className)} {...props} data-slot="combobox-content">
      <Command>{children}</Command>
    </Popover.Content>
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
    <Command.Input
      className={cn("h-9", className)}
      data-slot="combobox-input"
      placeholder={placeholder}
      kbd={false} // No Esc shortcut in combobox
    />
  );
};

/* ------------------------------ Combobox List ------------------------------ */

interface ComboboxListProps extends ComponentProps<typeof Command.List> {
  placeholder?: string;
}

const ComboboxList = ({
  children,
  className,
  placeholder = "No results found",
  ...props
}: ComboboxListProps) => {
  return (
    <Command.List className={className} {...props} data-slot="combobox-list">
      <Command.Empty>{placeholder}</Command.Empty>
      {children}
    </Command.List>
  );
};

/* ------------------------------ Combobox Group ------------------------------ */

const ComboboxGroup = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Command.Group>) => {
  return (
    <Command.Group className={className} {...props} data-slot="combobox-group">
      {children}
    </Command.Group>
  );
};

/* ------------------------------ Combobox Item ------------------------------ */

const ComboboxItem = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Command.Item>) => {
  return (
    <Command.Item className={className} {...props} data-slot="combobox-item">
      {children}
    </Command.Item>
  );
};

/* ------------------------------ Combobox Separator ------------------------------ */

const ComboboxSeparator = () => {
  return <div className="border-t border-border my-1" data-slot="combobox-separator"/>;
};

/* ------------------------------ Combobox Label ------------------------------ */

const ComboboxLabel = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
      data-slot="combobox-label"
    >
      {children}
    </div>
  );
};

/* ------------------------------ Exports ------------------------------ */

const ComboboxComposed = Object.assign(Combobox, {
  Trigger: ComboboxTrigger,
  TriggerButton: ComboboxTriggerButton,
  Content: ComboboxContent,
  Input: ComboboxInput,
  List: ComboboxList,
  Group: ComboboxGroup,
  Item: ComboboxItem,
  Separator: ComboboxSeparator,
  Label: ComboboxLabel,
});

export {
  ComboboxComposed as Combobox,
  ComboboxTrigger,
  ComboboxTriggerButton,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxLabel,
};