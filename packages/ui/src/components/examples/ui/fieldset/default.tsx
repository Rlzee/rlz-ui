import { Fieldset } from "@rlz/ui/components/ui/fieldset";
import { Field } from "@rlz/ui/components/ui/field";
import { Input } from "@rlz/ui/components/ui/input";

export default function Example() {
  return (
    <Fieldset className="max-w-xs">
      <Fieldset.Header>
        <Fieldset.Legend>Billing address</Fieldset.Legend>
        <Fieldset.Description>
          Enter the address associated with your payment method.
        </Fieldset.Description>
      </Fieldset.Header>
      <Field name="address">
        <Field.Label>Street address</Field.Label>
        <Input placeholder="123 Main St" type="text" />
        <Field.Error>Please enter a valid address.</Field.Error>
      </Field>
      <Field name="city">
        <Field.Label>City</Field.Label>
        <Input placeholder="Paris" type="text" />
        <Field.Error>Please enter a valid city.</Field.Error>
      </Field>
    </Fieldset>
  );
}
