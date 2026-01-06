import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

/* ------------------------------ Root Collapsible ------------------------------ */

function CollapsibleRoot(
  props: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
) {
  return <CollapsiblePrimitive.Root data-slot="collapsible-root" {...props} />;
}

/* ------------------------------ Collapsible Trigger ------------------------------ */

function CollapsibleTrigger(
  props: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

/* ------------------------------ Collapsible Panel ------------------------------ */

function CollapsiblePanel(
  props: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-panel" {...props} />
  );
}

/* ------------------------------ Exports ------------------------------ */

const CollapsibleExports = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
});

export {
  CollapsibleExports as Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
};
