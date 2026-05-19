import { Group } from "@rlz/ui/components/ui/group";
import { Button } from "@rlz/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Example() {
  return (
    <div className="flex gap-8">
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
      <div className="flex flex-col items-start gap-4">
        <Group>
          <Button size="icon-xs" variant="outline">
            <ArrowLeft />
          </Button>
          <Group.Separator />
          <Button size="xs" variant="outline">
            Icon-xs
          </Button>
        </Group>
        <Group>
          <Button size="icon-sm" variant="outline">
            <ArrowLeft />
          </Button>
          <Group.Separator />
          <Button size="sm" variant="outline">
            Icon-sm
          </Button>
        </Group>
        <Group>
          <Button size="icon-md" variant="outline">
            <ArrowLeft />
          </Button>
          <Group.Separator />
          <Button size="md" variant="outline">
            Icon-md
          </Button>
        </Group>
        <Group>
          <Button size="icon-lg" variant="outline">
            <ArrowLeft />
          </Button>
          <Group.Separator />
          <Button size="lg" variant="outline">
            Icon-lg
          </Button>
        </Group>
        <Group>
          <Button size="icon-xl" variant="outline">
            <ArrowLeft />
          </Button>
          <Group.Separator />
          <Button size="xl" variant="outline">
            Icon-xl
          </Button>
        </Group>
      </div>
    </div>
  );
}
