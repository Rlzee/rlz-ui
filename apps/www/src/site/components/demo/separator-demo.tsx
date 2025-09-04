import { Separator } from "@ui/components/separator";

const code = `import { Separator } from "@ui/components/separator";

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-6 justify-center">
      <div className="flex items-center gap-2">
        <span className="text-foreground">Text1</span>
        <Separator orientation="vertical" />
        <span className="text-foreground">Text2</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-foreground">Text1</span>
        <Separator orientation="horizontal" />
        <span className="text-foreground">Text2</span>
      </div>
    </div>
  );
};`;

const Component = () => {
  return (
    <div className="flex flex-col items-center gap-6 justify-center">
      <div className="flex items-center gap-2">
        <span className="text-foreground">Text1</span>
        <Separator orientation="vertical" />
        <span className="text-foreground">Text2</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-foreground">Text1</span>
        <Separator orientation="horizontal" />
        <span className="text-foreground">Text2</span>
      </div>
    </div>
  );
};

export const SeparatorDemo = {
  code,
  component: <Component />,
};
