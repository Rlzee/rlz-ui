import { Group } from "@rlz/ui/components/ui/group";
import { Button } from "@rlz/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Example() {
  return (
    <Group>
      <Group>
        <Button size="icon-md" variant="outline">
          <ArrowLeft />
        </Button>
      </Group>
      <Group>
        <Button variant="outline">Archive</Button>
        <Group.Separator />
        <Button variant="outline">Report</Button>
      </Group>
    </Group>
  );
}
