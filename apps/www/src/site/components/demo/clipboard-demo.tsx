import { Clipboard } from "@ui/components/clipboard";

const code = `import { Clipboard } from "@ui/components/clipboard";

export default function Example() {
  const text = "Hello, Clipboard!";

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-muted-foreground">{text}</span>
      <Clipboard text={text} />
    </div>
  );
}`;

const Component = () => {
  const text = "Hello, Clipboard!";
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-muted-foreground">{text}</span>
      <Clipboard text={text} />
    </div>
  );
};

export const ClipboardDemo = {
  code,
  component: <Component />,
};
