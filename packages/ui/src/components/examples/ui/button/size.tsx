import { Button } from "@rlz/ui/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-3 sm:flex-row">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
      <div className="flex gap-3 sm:flex-row">
        <Button size="icon-xs">
          <ArrowUpRight />
        </Button>
        <Button size="icon-sm">
          <ArrowUpRight />
        </Button>
        <Button size="icon-md">
          <ArrowUpRight />
        </Button>
        <Button size="icon-lg">
          <ArrowUpRight />
        </Button>
        <Button size="icon-xl">
          <ArrowUpRight />
        </Button>
      </div>
    </div>
  );
}
