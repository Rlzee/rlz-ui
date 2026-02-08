import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { Plus, type LucideIcon } from "lucide-react";

function AccordionRoot(props: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion-root" {...props} />;
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionHeader({
  className,
  ...props
}: AccordionPrimitive.Header.Props) {
  return (
    <AccordionPrimitive.Header
      data-slot="accordion-header"
      className={cn("flex", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionHeader>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "relative flex w-full items-baseline justify-between gap-4 py-4 bg-transparent text-left text-sm font-medium [&[data-panel-open]>svg]:rotate-45 [&[data-panel-open]>svg]:scale-110",
          className,
        )}
        {...props}
      />
    </AccordionHeader>
  );
}

function AccordionIcon({
  icon: Icon = Plus,
  className,
}: React.ComponentProps<LucideIcon> & {
  icon?: LucideIcon;
}) {
  return (
    <Icon
      data-slot="accordion-icon"
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        className,
      )}
    />
  );
}

function AccordionPanel({
  children,
  className,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Panel>
  );
}

const AccordionExport = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Panel: AccordionPanel,
});

export {
  AccordionExport as Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionIcon,
  AccordionPanel,
};
