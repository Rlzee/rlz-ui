import { ContextMenu } from "@rlz/ui/components/ui/context-menu";

export default function Example() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className="flex h-48 w-96 items-center justify-center rounded border border-dashed text-muted-foreground select-none">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Popup className="w-40">
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
          <ContextMenu.CheckboxItem checked variant="solid">
            Show grid
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem variant="solid">
            Show rulers
          </ContextMenu.CheckboxItem>
        </ContextMenu.Group>
      </ContextMenu.Popup>
    </ContextMenu>
  );
}
