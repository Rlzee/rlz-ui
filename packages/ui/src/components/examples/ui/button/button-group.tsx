import { Button } from "@rlz/ui/components/ui/button";
import { Group } from "@rlz/ui/components/ui/group";
import { Plus } from "lucide-react";

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
      <Group>
        <Button variant="outline">Button 1</Button>
        <Button variant="outline">Button 2</Button>
      </Group>
    </Group>
  );
}
