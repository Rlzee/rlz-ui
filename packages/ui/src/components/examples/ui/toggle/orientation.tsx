import { Toggle } from "@rlz/ui/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

export default function Example() {
  return (
    <Toggle.Group orientation="vertical" variant="outline" size="icon-md">
      <Toggle aria-label="Toggle bold" value="bold">
        <Bold />
      </Toggle>
      <Toggle.GroupSeparator />
      <Toggle aria-label="Toggle italic" value="italic">
        <Italic />
      </Toggle>
      <Toggle.GroupSeparator />
      <Toggle aria-label="Toggle underline" value="underline">
        <Underline />
      </Toggle>
    </Toggle.Group>
  );
}
