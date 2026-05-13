import { Button } from "@rlz/ui/components/ui/button";
import { Group } from "@rlz/ui/components/ui/group";
import { Plus, Minus } from "lucide-react";

export default function Example() {
  return (
    <Group>
      <Button>Group</Button>
      <Group.Separator />
      <Button size="icon-md">
        <Plus />
      </Button>
    </Group>
  );
}
