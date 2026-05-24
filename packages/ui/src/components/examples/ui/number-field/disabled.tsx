import { NumberField } from "@rlz/ui/components/ui/number-field";

export default function Example() {
  return (
    <NumberField defaultValue={0} disabled>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField>
  );
}
