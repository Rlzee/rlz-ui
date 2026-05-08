import { Kbd } from "@rlz/ui/components/ui/kbd";
import { InputGroup } from "@rlz/ui/components/ui/input-group";

export default function Example() {
  return (
    <InputGroup className="w-70">
      <InputGroup.Input placeholder="Search..." />
      <InputGroup.Addon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroup.Addon>
    </InputGroup>
  );
}
