import { Collapsible } from "@ui/components/collapsible";
import { Button } from "@ui/components/button";
import { ChevronsUpDown } from "lucide-react";

const code = `import { ChevronsUpDown } from "lucide-react";
import { Collapsible } from "@ui/components/collapsible";
import { Button } from "@ui/components/button";

export default function Example() {
  return (
    <Collapsible className="flex w-[200px] flex-col gap-2">
      <div className="flex items-center justify-between gap-2 px-1">
        <h4 className="text-sm font-semibold">Collapsible</h4>
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </Collapsible.Trigger>
      </div>
      <div className="rounded-md border border-border px-4 py-2 font-mono text-sm">
        Collapsible Demo
      </div>
      <Collapsible.Content className="flex flex-col gap-2 text-muted-foreground font-mono text-sm">
        <div className="rounded-md border border-border px-4 py-2">
          content 1
        </div>
        <div className="rounded-md border border-border px-4 py-2">
          content 2
        </div>
      </Collapsible.Content>
    </Collapsible>
  );
}`;

function Components() {
  return (
    <div className="flex items-center justify-center">
      <Collapsible className="flex w-[200px] flex-col gap-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <h4 className="text-sm font-semibold">Collapsible</h4>
          <Collapsible.Trigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </Collapsible.Trigger>
        </div>
        <div className="rounded-md border border-border px-4 py-2 font-mono text-sm">
          Collapsible Demo
        </div>
        <Collapsible.Content className="flex flex-col gap-2 text-muted-foreground font-mono text-sm">
          <div className="rounded-md border border-border px-4 py-2">
            content 1
          </div>
          <div className="rounded-md border border-border px-4 py-2">
            content 2
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

export const CollapsibleDemo = {
  code,
  component: <Components />,
};
