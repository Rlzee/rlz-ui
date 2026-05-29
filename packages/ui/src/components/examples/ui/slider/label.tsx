import { Slider } from "@rlz/ui/components/ui/slider";
import { Field } from "@rlz/ui/components/ui/field";

export default function Example() {
  return (
    <Field className="max-w-xs w-full">
      <Slider defaultValue={50}>
        <Field.Group className="justify-between">
          <Field.Label>Opacity</Field.Label>
          <Slider.Value />
        </Field.Group>
      </Slider>
    </Field>
  );
}
