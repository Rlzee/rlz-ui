import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { Plus, type LucideIcon } from "lucide-react";

/* ------------------------------ Root Accordion ------------------------------ */

function AccordionRoot({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(
        "box-border flex w-full flex-col justify-center",
        className
      )}
      {...props}
    />
  );
}

/* ---------------------------- Accordion Item ---------------------------- */

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b", className)}
      {...props}
    />
  );
}

/* -------------------------- Accordion Header -------------------------- */

function AccordionHeader(
  props: React.ComponentProps<typeof AccordionPrimitive.Header>
) {
  return <AccordionPrimitive.Header data-slot="accordion-header" {...props} />;
}

/* -------------------------- Accordion Trigger -------------------------- */

function AccordionTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "relative flex w-full items-baseline justify-between gap-4 hover:bg-accent py-3 px-3 bg-secondary text-left font-medium [&[data-panel-open]>svg]:rotate-45 [&[data-panel-open]>svg]:scale-110",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------- Accordion Icon -------------------------- */

function AccordionIcon({
  icon: Icon = Plus,
  className,
}: {
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Icon
      data-slot="accordion-icon"
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        className
      )}
    />
  );
}

/* ------------------------- Accordion Panel ------------------------- */

type AccordionPanelProps = React.ComponentProps<
  typeof AccordionPrimitive.Panel
> & {
  children?: React.ReactNode;
};

function AccordionPanel({
  children,
  className,
  ...props
}: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-sm text-muted-foreground transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-4 px-3">{children}</div>
    </AccordionPrimitive.Panel>
  );
}

/* ------------------------- Exports ------------------------- */

const AccordionExport = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Panel: AccordionPanel,
});

export {
  AccordionExport as Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionIcon,
  AccordionPanel,
};
