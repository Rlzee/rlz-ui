import { Menubar } from "@rlz/ui/components/ui/menubar";
import { Menu } from "@rlz/ui/components/ui/menu";

export default function Example() {
  return (
    <Menubar>
      <Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menu.Popup>
          <Menu.Item>
            New Window<Menu.Shortcut>⌘N</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            New Tab<Menu.Shortcut>⌘T</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Open File<Menu.Shortcut>⌘O</Menu.Shortcut>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item>
            Save As...<Menu.Shortcut>⇧⌘S</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Close Window<Menu.Shortcut>⌘W</Menu.Shortcut>
          </Menu.Item>
        </Menu.Popup>
      </Menu>

      <Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menu.Popup>
          <Menu.Item>
            Undo<Menu.Shortcut>⌘Z</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Redo<Menu.Shortcut>⇧⌘Z</Menu.Shortcut>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item>
            Cut<Menu.Shortcut>⌘X</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Copy<Menu.Shortcut>⌘C</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Paste<Menu.Shortcut>⌘V</Menu.Shortcut>
          </Menu.Item>
        </Menu.Popup>
      </Menu>

      <Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menu.Popup>
          <Menu.Item>
            Reload<Menu.Shortcut>⌘R</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Toggle Fullscreen<Menu.Shortcut>⌃⌘F</Menu.Shortcut>
          </Menu.Item>
          <Menu.Item>
            Toggle Developer Tools<Menu.Shortcut>⌥⌘I</Menu.Shortcut>
          </Menu.Item>
        </Menu.Popup>
      </Menu>

      <Menu disabled>
        <Menubar.Trigger>Help</Menubar.Trigger>
      </Menu>
    </Menubar>
  );
}
