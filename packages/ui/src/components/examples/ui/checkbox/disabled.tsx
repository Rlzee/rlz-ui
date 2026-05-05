import { Checkbox } from "@rlz/ui/components/ui/checkbox";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <Label>
      <Checkbox defaultChecked disabled />
      Accept terms and conditions
    </Label>
  );
}
