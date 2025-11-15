import { Select } from "@ui/components/select";

const code = `import { Select } from "@ui/components/select";

export default function Example() {
  return (
    <Select>
      <Select.Trigger
        className="w-[200px]"
        placeholder="Select a framework"
      />
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="grapes">Grapes</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="broccoli">Broccoli</Select.Item>
          <Select.Item value="spinach">Spinach</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Select>
        <Select.Trigger
          className="w-[200px]"
          placeholder="Select a framework"
        />
        <Select.Content>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
            <Select.Item value="blueberry">Blueberry</Select.Item>
            <Select.Item value="grapes">Grapes</Select.Item>
            <Select.Item value="pineapple">Pineapple</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Vegetables</Select.Label>
            <Select.Item value="carrot">Carrot</Select.Item>
            <Select.Item value="broccoli">Broccoli</Select.Item>
            <Select.Item value="spinach">Spinach</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
    </div>
  );
};

export const SelectDemo = {
  code,
  component: <Component />,
};
