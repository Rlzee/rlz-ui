import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Input } from "@rlz/ui/components/ui/input";
import { Search } from "lucide-react";

export default function Example() {
  return (
    <InputGroup className="w-64">
      <InputGroup.Addon>
        <Search />
      </InputGroup.Addon>
      <Input unstyled placeholder="Search" />
    </InputGroup>
  );
}
