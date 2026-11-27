import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Kbd } from "@rlz/ui/components/ui/kbd";

export default function Example() {
  return (
    <InputGroup className="max-w-sm">
      <Input aria-label="Search" placeholder="Search…" />
      <InputGroup.Addon align="inline-end">
        <Kbd>⌘ K</Kbd>
      </InputGroup.Addon>
    </InputGroup>
  );
}
