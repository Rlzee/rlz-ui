import { Group } from "@rlz/ui/components/ui/group";
import { Button } from "@rlz/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Group>
        <Button size="xs" variant="outline">
          Xs
        </Button>
        <Group.Separator />
        <Button size="xs" variant="outline">
          Button
        </Button>
      </Group>
      <Group>
        <Button size="sm" variant="outline">
          Sm
        </Button>
        <Group.Separator />
        <Button size="sm" variant="outline">
          Button
        </Button>
      </Group>
      <Group>
        <Button size="md" variant="outline">
          Md
        </Button>
        <Group.Separator />
        <Button size="md" variant="outline">
          Button
        </Button>
      </Group>
      <Group>
        <Button size="lg" variant="outline">
          Lg
        </Button>
        <Group.Separator />
        <Button size="lg" variant="outline">
          Button
        </Button>
      </Group>
      <Group>
        <Button size="xl" variant="outline">
          Xl
        </Button>
        <Group.Separator />
        <Button size="xl" variant="outline">
          Button
        </Button>
      </Group>
    </div>
  );
}
