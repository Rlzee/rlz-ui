import { Button } from "@rlz/ui/components/ui/button";
import { Group } from "@rlz/ui/components/ui/group";
import { Plus, Minus } from "lucide-react";
import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <Group>
      <Group>
        <Button>Primary</Button>
        <Group.Separator />
        <Button size="icon-md">
          <Plus />
        </Button>
      </Group>
      <Group orientation="vertical">
        <Button size="icon-md" variant="outline">
          <Plus />
        </Button>
        <Group.Separator />
        <Button size="icon-md" variant="outline">
          <Minus />
        </Button>
      </Group>
    </Group>
  );
}
