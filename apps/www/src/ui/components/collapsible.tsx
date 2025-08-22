import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ComponentProps } from "react";

/* ------------------------------ Root Collapsible ------------------------------ */

const Collapsible = (
  props: ComponentProps<typeof CollapsiblePrimitive.Root>
) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

/* ------------------------------ Collapsible Trigger ------------------------------ */

const CollapsibleTrigger = (
  props: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>
) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
};

/* ------------------------------ Collapsible Content ------------------------------ */

const CollapsibleContent = (
  props: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>
) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
};

/* ------------------------------ Exports ------------------------------ */

const CollapsibleComposed = Object.assign(Collapsible, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});

export {
  CollapsibleComposed as Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
};
