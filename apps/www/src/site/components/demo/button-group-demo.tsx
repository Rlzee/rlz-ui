import { ButtonGroup } from "@ui/components/button-group";

const code = `import { ButtonGroup } from "@ui/components/button-group";

export default function Example() {
  return (
    <ButtonGroup variant="outline" size="sm">
      <ButtonGroup.Item>Button 1</ButtonGroup.Item>
      <ButtonGroup.Item>Button 2</ButtonGroup.Item>
      <ButtonGroup.Item>Button 3</ButtonGroup.Item>
    </ButtonGroup>
  );
}`;

const Component = () => {
  return (
    <ButtonGroup variant="outline" size="sm" className="mx-auto max-w-[600px]">
      <ButtonGroup.Item>Button 1</ButtonGroup.Item>
      <ButtonGroup.Item>Button 2</ButtonGroup.Item>
      <ButtonGroup.Item>Button 3</ButtonGroup.Item>
    </ButtonGroup>
  );
};

export const ButtonGroupDemo = {
  code,
  component: <Component />,
};
