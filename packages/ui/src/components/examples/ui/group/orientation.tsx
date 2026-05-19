import { Group } from "@rlz/ui/components/ui/group";
import { Button } from "@rlz/ui/components/ui/button";
import { Plus, Minus } from "lucide-react";

export default function Example() {
  return (
    <Group orientation="vertical">
      <Button size="icon-md" variant="outline">
        <Plus />
      </Button>
      <Group.Separator />
      <Button size="icon-md" variant="outline">
        <Minus />
      </Button>
    </Group>
  );
}
