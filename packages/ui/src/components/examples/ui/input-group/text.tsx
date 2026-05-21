import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <InputGroup className="max-w-xs has-data-[align=inline-start]:[&_input]:ps-0">
      <InputGroup.Addon>
        <InputGroup.Text>https://</InputGroup.Text>
      </InputGroup.Addon>
      <Input unstyled placeholder="example" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup>
  );
}
