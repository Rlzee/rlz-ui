import { Toolbar } from "@rlz/ui/components/ui/toolbar";
import { Toggle } from "@rlz/ui/components/ui/toggle";
import { Button } from "@rlz/ui/components/ui/button";
import { Select } from "@rlz/ui/components/ui/select";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  DollarSign,
  Percent,
} from "lucide-react";

const items = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Arial", value: "arial" },
];

export default function Example() {
  return (
    <Toolbar>
      <Toggle.Group size="xs">
        <Toolbar.Button render={<Toggle value="left" />}>
          <AlignLeft />
        </Toolbar.Button>
        <Toolbar.Button render={<Toggle value="center" />}>
          <AlignCenter />
        </Toolbar.Button>
        <Toolbar.Button render={<Toggle value="right" />}>
          <AlignRight />
        </Toolbar.Button>
      </Toggle.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.Button render={<Button variant="ghost" size="xs" />}>
          <DollarSign />
        </Toolbar.Button>
        <Toolbar.Button render={<Button variant="ghost" size="xs" />}>
          <Percent />
        </Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Select defaultValue={items[0]} items={items}>
        <Select.Trigger size="xs" className="bg-accent/60 w-40">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Popup>
          {items.map(({ label, value }) => (
            <Select.Item key={value} value={value}>
              <Select.ItemText>{label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Popup>
      </Select>
      <Toolbar.Separator />
      <Toolbar.Text className="pl-6">Edited 51m ago</Toolbar.Text>
    </Toolbar>
  );
}
