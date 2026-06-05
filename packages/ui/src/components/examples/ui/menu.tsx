import { Menu } from "@rlz/ui/components/ui/menu";
import { Button } from "@rlz/ui/components/ui/button";
import { Send, Reply, ReplyAll, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <Menu>
      <Menu.Trigger render={<Button variant="outline" />}>Open</Menu.Trigger>
      <Menu.Popup className="w-40">
        <Menu.Arrow />
        <Menu.Group>
          <Menu.Item>s
            <Send /> Forward
            <Menu.Shortcut>⌘F</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            <Reply /> Reply
            <Menu.Shortcut>⌘R</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            <ReplyAll /> Reply all
            <Menu.Shortcut>⌘A</Menu.Shortcut>
          </Menu.Item>
        </Menu.Group>
        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>View</Menu.GroupLabel>
          <Menu.CheckboxItem checked>Show grid</Menu.CheckboxItem>
          <Menu.CheckboxItem>Show rulers</Menu.CheckboxItem>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Theme</Menu.GroupLabel>
          <Menu.RadioGroup defaultValue="system">
            <Menu.RadioItem value="light">Light</Menu.RadioItem>
            <Menu.RadioItem value="dark">Dark</Menu.RadioItem>
            <Menu.RadioItem value="system">System</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Submenu>
          <Menu.SubmenuTrigger>Export as</Menu.SubmenuTrigger>
          <Menu.Popup>
            <Menu.Item>PNG</Menu.Item>
            <Menu.Item>SVG</Menu.Item>
            <Menu.Item>PDF</Menu.Item>
          </Menu.Popup>
        </Menu.Submenu>

        <Menu.Separator />
        <Menu.Item variant="destructive">
          <Trash2 /> Delete
          <Menu.Shortcut>⌘ ⌫</Menu.Shortcut>
        </Menu.Item>
      </Menu.Popup>
    </Menu>
  );
}
