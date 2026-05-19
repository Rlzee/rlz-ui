import { Group } from "@rlz/ui/components/ui/group";
import { Input } from "@rlz/ui/components/ui/input";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <Group aria-label="Domain input" className="w-full max-w-64">
      <Input
        aria-label="Domain"
        defaultValue="rlz"
        id="domain-suffix"
        type="text"
      />
      <Group.Separator />
      <Group.Text
        render={<Label aria-label="Domain suffix" htmlFor="domain-suffix" />}
      >
        .com
      </Group.Text>
    </Group>
  );
}
