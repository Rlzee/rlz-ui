import { SeparatorBorder } from "@ui/components/separator-border";

const code = `import { SeparatorBorder } from "@ui/components/separator-border";

export default function Example() {
  return (
    <div className="flex items-center justify-center h-72">
      <SeparatorBorder orientation="vertical" />
    </div>
  );
};`;

const Component = () => {
  return (
    <div className="flex items-center justify-center h-72">
      <SeparatorBorder orientation="vertical" />
    </div>
  );
};

export const SeparatorBorderDemo = {
  code,
  component: <Component />,
};
