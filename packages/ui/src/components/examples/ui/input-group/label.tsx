import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <InputGroup className="w-64">
      <InputGroup.Addon align="block-start">
        <Label className="text-foreground" htmlFor="email-1">
          Email
        </Label>
      </InputGroup.Addon>
      <Input unstyled id="email-1" placeholder="rlz@example.com" type="email" />
    </InputGroup>
  );
}
