import { ComponentProps } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, type LucideIcon } from "lucide-react";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Accordion ------------------------------ */

const Accordion = (props: ComponentProps<typeof AccordionPrimitive.Root>) => {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
};

/* ------------------------------ Accordion Item ------------------------------ */

const AccordionItem = ({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={className}
      {...props}
    />
  );
};

/* ------------------------------ Accordion Header ------------------------------ */

const AccordionHeader = ({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Header>) => {
  return (
    <AccordionPrimitive.Header
      data-slot="accordion-header"
      className={cn("flex", className)}
      {...props}
    />
  );
};

/* ------------------------------ Accordion Trigger ------------------------------ */

const AccordionTrigger = ({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) => {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  );
};

/* ------------------------------ Accordion Icon ------------------------------ */

const AccordionIcon = ({
  Icon = ChevronDownIcon,
  className,
}: {
  Icon?: LucideIcon;
  className?: string;
}) => {
  return (
    <Icon
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        className
      )}
    />
  );
};

/* ------------------------------ Accordion Content ------------------------------ */

const AccordionContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
};

/* ------------------------------ Exports ------------------------------ */

const AccordionComposed = Object.assign(Accordion, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Content: AccordionContent,
});

export {
  AccordionComposed as Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionIcon,
  AccordionContent,
};
