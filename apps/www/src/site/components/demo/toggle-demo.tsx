import { Toggle } from "@ui/components/toggle";

const code = `import { Toggle } from "@ui/components/toggle";

export default function Example() {
  return (
    <Toggle>Toggle Me</Toggle>
    <Toggle variant="outline">Toggle Me</Toggle>
    <Toggle defaultPressed>Toggle Me</Toggle>
  );
};`;

const Component = () => {
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-[200px]">
        <Toggle>Toggle Me</Toggle>
        <Toggle variant="outline">Toggle Me</Toggle>
        <Toggle defaultPressed>Toggle Me</Toggle>
    </div>
  );
};

export const ToggleDemo = {
  code,
  component: <Component />
};
