import { NumberField } from "@rlz/ui/components/ui/number-field";
import { Group } from "@rlz/ui/components/ui/group";

export default function Example() {
  return (
    <NumberField defaultValue={0}>
      <NumberField.Group>
        <NumberField.Decrement />
        <Group.Separator />
        <NumberField.Input />
        <Group.Separator />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField>
  );
}
