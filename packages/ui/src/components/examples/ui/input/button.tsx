import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Button } from "@rlz/ui/components/ui/button";

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
        <Button size="xs">Send</Button>
      </InputGroup.Addon>
    </InputGroup>
  );
}
