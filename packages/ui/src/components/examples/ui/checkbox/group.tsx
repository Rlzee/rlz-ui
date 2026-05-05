import { Checkbox } from "@rlz/ui/components/ui/checkbox";
import { Label } from "@rlz/ui/components/ui/label";

export default function Example() {
  return (
    <Checkbox.Group aria-label="Select frameworks" defaultValue={["next"]}>
      <Label>
        <Checkbox value="next" />
        Next.js
      </Label>
      <Label>
        <Checkbox value="vite" />
        Vite
      </Label>
      <Label>
        <Checkbox value="astro" />
        Astro
      </Label>
    </Checkbox.Group>
  );
}
