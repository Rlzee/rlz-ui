import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <Field className="w-full max-w-64">
      <Field.Label>Name</Field.Label>
      <Input placeholder="Enter your name" type="text" />
      <Field.Description>Visible on your profile</Field.Description>
    </Field>
  );
}
