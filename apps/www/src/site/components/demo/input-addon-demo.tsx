import { InputAddon } from "@ui/components/input-addon";

const code = `import { InputAddon } from "@ui/components/input-addon";

export function Example() {
  return (
    <InputAddon placeholder="0.00" className="pr-12 pl-8">
      <InputAddon.Left>$</InputAddon.Left>
      <InputAddon.Right>USD</InputAddon.Right>
    </InputAddon>
  );
};

export default InputAddonDemo;
`;

const Component = () => {
  return (
    <div className="mx-auto w-[300px]">
    <InputAddon placeholder="0.00" className="pr-12 pl-8">
      <InputAddon.Left>$</InputAddon.Left>
      <InputAddon.Right>USD</InputAddon.Right>
    </InputAddon>
    </div>
  );
};

export const InputAddonDemo = {
    code,
    component: <Component />
}
