import { Radio } from "@rlz/ui/components/ui/radio-group";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <Radio.Group aria-label="Select frameworks" defaultValue={["next"]}>
      <Label>
        <Radio value="next" />
        Next.js
      </Label>
      <Label>
        <Radio value="vite" disabled />
        Vite (disabled)
      </Label>
      <Label>
        <Radio value="astro" />
        Astro
      </Label>
    </Radio.Group>
  );
}
