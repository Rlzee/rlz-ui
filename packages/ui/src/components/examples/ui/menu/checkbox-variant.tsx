import { Menu } from "@rlz/ui/components/ui/menu";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <Menu>
      <Menu.Trigger render={<Button variant="outline" />}>Open</Menu.Trigger>
      <Menu.Popup className="w-40">
        <Menu.Arrow />
        <Menu.Group>
          <Menu.GroupLabel>View</Menu.GroupLabel>
          <Menu.CheckboxItem checked variant="solid">
            Show grid
          </Menu.CheckboxItem>
          <Menu.CheckboxItem variant="solid">Show rulers</Menu.CheckboxItem>
        </Menu.Group>
      </Menu.Popup>
    </Menu>
  );
}
