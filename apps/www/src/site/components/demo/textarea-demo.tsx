import { Textarea } from "@ui/components/textarea";

const code = `import { Textarea } from "@ui/components/textarea";

export default function Example() {
  return <Textarea placeholder="Enter text" />;
};`;

const Components = () => {
  return (
    <div className="mx-auto max-w-[300px]">
      <Textarea placeholder="Enter text" />
    </div>
  );
};

export const TextareaDemo = {
  code,
  component: <Components />,
};
