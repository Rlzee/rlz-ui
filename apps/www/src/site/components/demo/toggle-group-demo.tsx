import { ToggleGroup } from "@ui/components/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";

const code = `import { ToggleGroup } from "@ui/components/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";

export default function Example() {
    return (
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroup.Item value="bold" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="strikethrough"
          aria-label="Toggle strikethrough"
        >
          <Underline className="h-4 w-4" />
        </ToggleGroup.Item>
      </ToggleGroup>
    );
};`;

const Component = () => {
  return (
    <div className="flex items-center justify-center mx-auto">
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroup.Item value="bold" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="strikethrough"
          aria-label="Toggle strikethrough"
        >
          <Underline className="h-4 w-4" />
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
};

export const ToggleGroupDemo = {
  code,
  component: <Component />
};
