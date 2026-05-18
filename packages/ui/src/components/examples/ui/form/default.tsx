import { Form } from "@rlz/ui/components/ui/form";
import { Fieldset } from "@rlz/ui/components/ui/fieldset";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Form className="flex flex-col gap-4 w-full max-w-64">
      <Field name="email">
        <Field.Label>Email</Field.Label>
        <Input placeholder="rlz@example.com" required type="email" />
        <Field.Error>Please enter a valid email.</Field.Error>
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
