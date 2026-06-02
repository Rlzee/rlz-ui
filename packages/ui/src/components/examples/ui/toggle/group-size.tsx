import { Toggle } from "@rlz/ui/components/ui/toggle";
import { ArrowUpRight, ArrowUpLeft } from "lucide-react";

export default function Example() {
  return (
    <div className="flex gap-8">
      <div className="grid gap-4">
        <Toggle.Group variant="outline" size="xs">
          <Toggle>Extra</Toggle>
          <Toggle.GroupSeparator />
          <Toggle variant="outline" size="xs">
            Small
          </Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="sm">
          <Toggle>Small</Toggle>
          <Toggle.GroupSeparator />
          <Toggle>Size</Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="md">
          <Toggle>Medium</Toggle>
          <Toggle.GroupSeparator />
          <Toggle>Size</Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="lg">
          <Toggle>Large</Toggle>
          <Toggle.GroupSeparator />
          <Toggle>Size</Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="xl">
          <Toggle>Extra</Toggle>
          <Toggle.GroupSeparator />
          <Toggle>Large</Toggle>
        </Toggle.Group>
      </div>
      <div className="grid gap-4">
        <Toggle.Group variant="outline" size="icon-xs">
          <Toggle>
            <ArrowUpRight />
          </Toggle>
          <Toggle.GroupSeparator />
          <Toggle>
            <ArrowUpLeft />
          </Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="icon-sm">
          <Toggle>
            <ArrowUpRight />
          </Toggle>
          <Toggle.GroupSeparator />
          <Toggle>
            <ArrowUpLeft />
          </Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="icon-md">
          <Toggle>
            <ArrowUpRight />
          </Toggle>
          <Toggle.GroupSeparator />
          <Toggle>
            <ArrowUpLeft />
          </Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="icon-lg">
          <Toggle>
            <ArrowUpRight />
          </Toggle>
          <Toggle.GroupSeparator />
          <Toggle>
            <ArrowUpLeft />
          </Toggle>
        </Toggle.Group>
        <Toggle.Group variant="outline" size="icon-xl">
          <Toggle>
            <ArrowUpRight />
          </Toggle>
          <Toggle.GroupSeparator />
          <Toggle>
            <ArrowUpLeft />
          </Toggle>
        </Toggle.Group>
      </div>
    </div>
  );
}
