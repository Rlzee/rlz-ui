import { ComponentProps } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Button } from "@ui/components/button";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Select ------------------------------ */

const Select = (props: ComponentProps<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
};

/* ------------------------------ Select Trigger ------------------------------ */

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
  className?: string;
  placeholder?: string;
};

const SelectTrigger = ({
  className,
  placeholder,
  ...props
}: SelectTriggerProps) => {
  return (
    <SelectPrimitive.Trigger asChild data-slot="select-trigger" {...props}>
      <Button
        variant="outline"
        className={cn("w-[200px] justify-between", className)}
        data-slot="select-trigger-button"
        role="select"
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="opacity-50" />
        </SelectPrimitive.Icon>
      </Button>
    </SelectPrimitive.Trigger>
  );
};

/* ------------------------------ Select Content ------------------------------ */

const SelectContent = ({
  children,
  className,
  align = "center",
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-border",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        align={align}
        position={position}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          data-slot="select-viewport"
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

/* ------------------------------ Select Group ------------------------------ */

const SelectGroup = (props: ComponentProps<typeof SelectPrimitive.Group>) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
};

/* ------------------------------ Select Item ------------------------------ */

const SelectItem = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "dark:focus:bg-secondary/80 focus:brightness-95 [&_svg:not([class*='text-'])]:text-primary-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-muted-foreground" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
};

/* ------------------------------ Select Label ------------------------------ */

const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

/* ------------------------------ Select Separator ------------------------------ */

const SelectSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const SelectComposed = Object.assign(Select, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Group: SelectGroup,
  Item: SelectItem,
  Label: SelectLabel,
  Separator: SelectSeparator,
});

export { SelectComposed as Select, SelectTrigger };
