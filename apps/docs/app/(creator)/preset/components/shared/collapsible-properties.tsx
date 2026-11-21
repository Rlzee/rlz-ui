import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Button } from "@rlz/ui/components/ui/button";
import { ChevronRight } from "lucide-react";

type CollapsiblePropertiesProps = React.ComponentProps<typeof Collapsible> & {
  name: string;
};

export function CollapsibleProperties({
  name,
  children,
  ...props
}: CollapsiblePropertiesProps) {
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
        {name}
      </Collapsible.Trigger>
      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible>
  );
}
