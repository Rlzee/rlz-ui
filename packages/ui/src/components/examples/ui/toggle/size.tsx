import { Toggle } from "@rlz/ui/components/ui/toggle";
import { ArrowUpRight } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-3 sm:flex-row">
        <Toggle variant="outline" size="xs">
          Extra Small
        </Toggle>
        <Toggle variant="outline" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" size="md">
          Medium
        </Toggle>
        <Toggle variant="outline" size="lg">
          Large
        </Toggle>
        <Toggle variant="outline" size="xl">
          Extra Large
        </Toggle>
      </div>
      <div className="flex gap-3 sm:flex-row">
        <Toggle variant="outline" size="icon-xs">
          <ArrowUpRight />
        </Toggle>
        <Toggle variant="outline" size="icon-sm">
          <ArrowUpRight />
        </Toggle>
        <Toggle variant="outline" size="icon-md">
          <ArrowUpRight />
        </Toggle>
        <Toggle variant="outline" size="icon-lg">
          <ArrowUpRight />
        </Toggle>
        <Toggle variant="outline" size="icon-xl">
          <ArrowUpRight />
        </Toggle>
      </div>
    </div>
  );
}
