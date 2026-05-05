import { Collapsible } from "@rlz/ui/components/ui/collapsible";
import { Button } from "@rlz/ui/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Example() {
  return (
    <Collapsible>
      <Collapsible.Trigger
        className="data-panel-open:[&_svg]:rotate-180 w-50"
        render={
          <Button variant="secondary" size="sm" className="justify-start" />
        }
      >
        <ChevronDown />
        Recovery keys
      </Collapsible.Trigger>
      <Collapsible.Panel className="">
        <ul className="flex flex-col gap-1.5 py-2 text-muted-foreground text-sm">
          <li className="rounded-sm bg-secondary border px-2 py-1 font-mono">
            alien-bean-pasta
          </li>
          <li className="rounded-sm bg-secondary border px-2 py-1 font-mono">
            wild-irish-burrito
          </li>
          <li className="rounded-sm bg-secondary border px-2 py-1 font-mono">
            horse-battery-staple
          </li>
        </ul>
      </Collapsible.Panel>
    </Collapsible>
  );
}
