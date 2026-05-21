import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Kbd } from "@rlz/ui/components/ui/kbd";

export default function Example() {
  return (
    <InputGroup className="w-64">
      <Input
        aria-label="Enter text"
        placeholder="Enter text"
        type="text"
        unstyled
      />
      <InputGroup.Addon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroup.Addon>
    </InputGroup>
  );
}
