import { Toggle } from "@rlz/ui/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

export default function Example() {
  return (
    <div className="grid gap-4">
      <Toggle.Group variant="outline" size="icon-md">
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
      <Toggle.Group variant="outline" size="icon-md">
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
    </div>
  );
}
