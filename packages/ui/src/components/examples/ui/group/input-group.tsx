import { Group } from "@rlz/ui/components/ui/group";
import { Button } from "@rlz/ui/components/ui/button";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Paperclip, AudioLines } from "lucide-react";

export default function Example() {
  return (
    <Group
      aria-label="Message composer"
      className="[--radius-lg:9999px] [--radius:9999rem]"
    >
      <Group>
        <Button size="icon-md" variant="outline">
          <Paperclip aria-hidden="true" />
        </Button>
      </Group>
      <Group>
        <InputGroup>
          <Input placeholder="Send a message" unstyled />
          <InputGroup.Addon align="inline-end">
            <Button size="icon-xs" variant="ghost">
              <AudioLines />
            </Button>
          </InputGroup.Addon>
        </InputGroup>
      </Group>
    </Group>
  );
}
