import type { ComponentProps } from "react";
import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Button } from "@rlz/ui/components/ui/button";
import { ChevronRight, Edit, Trash2 } from "lucide-react";

type CollapsibleItemProps = ComponentProps<typeof Collapsible> & {
  triggerName: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function CollapsibleItem({
  triggerName,
  children,
  onEdit,
  onDelete,
  ...props
}: CollapsibleItemProps) {
  return (
    <Collapsible {...props}>
      <div className="group flex w-full items-center rounded-md hover:bg-accent [&_svg]:text-muted">
        <Collapsible.Trigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start data-panel-open:[&_svg]:rotate-90 hover:bg-transparent"
            />
          }
        >
          <ChevronRight />
          {triggerName}
        </Collapsible.Trigger>

        <div className="flex items-center gap-0">
          <Button
            type="button"
            variant="ghost"
            className="!px-0 opacity-0 transition-opacity group-hover:opacity-100 hover:[&_svg]:text-foreground"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.();
            }}
          >
            <Edit />
            <span className="sr-only">Edit {triggerName}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="opacity-0 transition-opacity group-hover:opacity-100 hover:[&_svg]:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
          >
            <Trash2 />
            <span className="sr-only">Delete {triggerName}</span>
          </Button>
        </div>
      </div>

      <Collapsible.Panel>{children}</Collapsible.Panel>
    </Collapsible>
  );
}
