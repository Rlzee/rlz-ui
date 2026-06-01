import { Toggle } from "@rlz/ui/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

export default function Example() {
  return (
    <Toggle.Group>
      <Toggle aria-label="Toggle bold" value="bold">
        <Bold />
      </Toggle>
      <Toggle aria-label="Toggle italic" value="italic">
        <Italic />
      </Toggle>
      <Toggle aria-label="Toggle underline" value="underline">
        <Underline />
      </Toggle>
    </Toggle.Group>
  );
}
