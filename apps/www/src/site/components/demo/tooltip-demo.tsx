import { Tooltip } from "@ui/components/tooltip";
import { Button } from "@ui/components/button";

const code = `import { Tooltip } from "@ui/components/tooltip";
import { Button } from "@ui/components/button";

export default function Example() {
    return (
      <Tooltip content="Hello, I am a tooltip!" side="top">
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    );
};`;

const Component = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-[100px]">
      <Tooltip content="Hello, I am a tooltip!" side="top">
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    </div>
  );
};

export const TooltipDemo = {
  code,
  component: <Component />
};
