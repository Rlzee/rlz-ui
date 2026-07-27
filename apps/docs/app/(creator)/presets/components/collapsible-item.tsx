import type { ComponentProps } from "react";
import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Button } from "@rlz/ui/components/ui/button";
import { ChevronRight } from "lucide-react";

type CollapsibleItemProps = ComponentProps<typeof Collapsible> & {
  triggerName: string;
};

export function CollapsibleItem({
  triggerName,
  children,
  ...props
}: CollapsibleItemProps) {
  return (
    <Collapsible {...props}>
      <Collapsible.Trigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="data-panel-open:[&_svg]:rotate-90 transition-colors w-full justify-start"
          />
        }
      >
        <ChevronRight />
        {triggerName}
      </Collapsible.Trigger>
      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible>
  );
}
