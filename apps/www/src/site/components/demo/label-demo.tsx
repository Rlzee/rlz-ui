import { Label } from "@ui/components/label";

const code = `import { Label } from "@ui/components/label";

export default function Example() {
  return <Label htmlFor="label">Label</Label>;
};`;

const Components = () => {
  return (
    <div className="mx-auto max-w-[50px]">
      <Label htmlFor="label">Label</Label>
    </div>
  );
};

export const LabelDemo = {
  code,
  component: <Components />,
};
