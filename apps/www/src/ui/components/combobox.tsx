import { ComponentProps } from "react";
import { ChevronsUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Command } from "@ui/components/command";
import { Popover } from "@ui/components/popover";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Combobox ------------------------------ */

const Combobox = (props: ComponentProps<typeof Popover>) => {
  return <Popover data-slot="combobox" {...props} />;
};

/* ------------------------------ Combobox Trigger ------------------------------ */

const ComboboxTrigger = (props: ComponentProps<typeof Popover.Trigger>) => {
  return <Popover.Trigger asChild {...props} data-slot="combobox-trigger" />;
};

/* ------------------------------ Combobox Trigger Button ------------------------------ */

interface ComboboxTriggerButtonProps extends ComponentProps<typeof Button> {
  placeholder?: string;
  chevron?: "up" | "down" | "both";
}

const ComboboxTriggerButton = ({
  placeholder = "Select an option",
  chevron = "both",
  className,
  ...props
}: ComboboxTriggerButtonProps) => {
  const icon =
    chevron === "up" ? (
      <ChevronUp className="opacity-50" />
    ) : chevron === "down" ? (
      <ChevronDown className="opacity-50" />
    ) : (
      <ChevronsUpDown className="opacity-50" />
    );

  return (
    <Button
      role="combobox"
      className={cn("w-[200px] justify-between", className)}
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
    <Popover.Content
      className={cn("w-[200px] p-0", className)}
      {...props}
      data-slot="combobox-content"
    >
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
      className={className}
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

const ComboboxList = ({ children, className, ...props }: ComboboxListProps) => {
  return (
    <Command.List className={className} {...props} data-slot="combobox-list">
      {children}
    </Command.List>
  );
};

/* ------------------------------ Combobox Empty ------------------------------ */

const ComboboxEmpty = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Command.Empty>) => {
  return (
    <Command.Empty {...props} className={cn("text-sm", className)} data-slot="combobox-empty">
      {children}
    </Command.Empty>
  );
};

/* ------------------------------ Combobox Group ------------------------------ */

const ComboboxGroup = (props: ComponentProps<typeof Command.Group>) => {
  return <Command.Group {...props} data-slot="combobox-group" />;
};

/* ------------------------------ Combobox Item ------------------------------ */

const ComboboxItem = (props: ComponentProps<typeof Command.Item>) => {
  return <Command.Item {...props} data-slot="combobox-item" />;
};

/* ------------------------------ Combobox Label ------------------------------ */

const ComboboxLabel = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
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
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  Item: ComboboxItem,
  Label: ComboboxLabel,
});

export {
  ComboboxComposed as Combobox,
  ComboboxTrigger,
  ComboboxTriggerButton,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
};