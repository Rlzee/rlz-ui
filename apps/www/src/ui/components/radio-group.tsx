import { ComponentProps, ReactNode } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Radio Group ------------------------------ */

const RadioGroup = ({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
};

/* ------------------------------ Radio Group Item ------------------------------ */

const RadioGroupItemBase = ({
  children,
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & {
  children?: ReactNode;
}) => {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "bg-secondary border-border text-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
};

/* ------------------------------ Radio Group Indicator ------------------------------ */

const RadioGroupIndicator = ({
  children,
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Indicator> & {
  children?: ReactNode;
}) => {
  return (
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className={cn("relative flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Indicator>
  );
};

/* ------------------------------ Radio Group Icon ------------------------------ */

const RadioGroupIcon = ({
  className,
  icon,
}: {
  className?: string;
  icon?: ReactNode;
}) => {
  return (
    <>
      {icon ? (
        <span
          className={cn(
            "size-2 flex items-center justify-center text-primary fill-primary",
            className
          )}
        >
          {icon}
        </span>
      ) : (
        <CircleIcon
          className={cn(
            "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
            className
          )}
        />
      )}
    </>
  );
};

/* ------------------------------ Radio Group Item ------------------------------ */

const RadioGroupItem = (
  props: ComponentProps<typeof RadioGroupPrimitive.Item>
) => {
  return (
    <RadioGroupItemBase {...props}>
      <RadioGroupIndicator>
        <RadioGroupIcon />
      </RadioGroupIndicator>
    </RadioGroupItemBase>
  );
};

/* ------------------------------ Exports ------------------------------ */

const RadioGroupComposed = Object.assign(RadioGroup, {
  Root: RadioGroup,
  ItemBase: RadioGroupItemBase,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
  Icon: RadioGroupIcon,
});

export {
  RadioGroupComposed as RadioGroup,
  RadioGroupItemBase,
  RadioGroupItem,
  RadioGroupIndicator,
  RadioGroupIcon,
};
