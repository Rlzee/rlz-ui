import { ContextMenu } from "@rlz/ui/components/ui/context-menu";
import { Menu } from "@rlz/ui/components/ui/menu";

export default function Example() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className="flex h-48 w-96 items-center justify-center rounded border border-dashed text-muted-foreground select-none">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Popup className="w-40">
        <Menu.Group>
          <Menu.GroupLabel>View</Menu.GroupLabel>
          <Menu.CheckboxItem checked variant="solid">
            Show grid
          </Menu.CheckboxItem>
          <Menu.CheckboxItem variant="solid">Show rulers</Menu.CheckboxItem>
        </Menu.Group>
      </ContextMenu.Popup>
    </ContextMenu>
  );
}