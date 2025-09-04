import { RadioGroup } from "@ui/components/radio-group";

const code = `import { RadioGroup } from "@ui/components/radio-group";

export default function Example() {
  return (
    <RadioGroup defaultValue="option1">
      <RadioGroup.Item id="radio1" value="option1" />
      <RadioGroup.Item id="radio2" value="option2" />
      <RadioGroup.Item id="radio3" value="option3" />
    </RadioGroup>
  );
};`;

const Component = () => {
  return (
    <div className="flex flex-col gap-2 mx-auto max-w-[40px]">
        <RadioGroup defaultValue="option1">
          <RadioGroup.Item id="radio1" value="option1" />
          <RadioGroup.Item id="radio2" value="option2" />
          <RadioGroup.Item id="radio3" value="option3" />
        </RadioGroup>
    </div>
  );
};

export const RadioGroupDemo = {
    code,
    component: <Component />
};
