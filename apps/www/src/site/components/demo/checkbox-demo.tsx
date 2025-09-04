import { Checkbox } from "@ui/components/checkbox";

const code = `import { Checkbox } from "@ui/components/checkbox";

export default function Example() {
  return (
    <Checkbox className="h-6 w-6">Checkbox</Checkbox>
  );
}`;

const Component = () => {
  return (
    <div className="flex justify-center items-center">
        <Checkbox className="h-6 w-6">Checkbox</Checkbox>
    </div>
  );
};

export const CheckboxDemo = {
    code,
    component: <Component />
};
