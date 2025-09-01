import { Input } from "@ui/components/input";

const code = `import { Input } from "@ui/components/input";

export default function Example() {
  return <Input placeholder="Enter text" />;
};`;

const Components = () => {
  return (
    <div className="mx-auto max-w-[300px]">
      <Input placeholder="Enter text" />
    </div>
  );
};

export const InputDemo = {
  code,
  component: <Components />,
};
