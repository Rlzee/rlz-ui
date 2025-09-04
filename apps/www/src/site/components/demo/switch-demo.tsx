import { Switch } from "@ui/components/switch";

const code = `import { Switch } from "@ui/components/switch";

export default function Example() {
  return (
    <Switch id="switch1" />
  );
}`;

const Component = () => {
  return (
    <div className="flex justify-center items-center">
      <Switch id="switch1" />
    </div>
  );
};

export const SwitchDemo = {
  code,
  component: <Component />,
};
