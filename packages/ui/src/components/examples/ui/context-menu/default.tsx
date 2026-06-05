import { ContextMenu } from "@rlz/ui/components/ui/context-menu";
import { Send, Reply, ReplyAll, Trash2 } from "lucide-react";

export default function Example() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className="flex h-48 w-96 items-center justify-center rounded border border-dashed text-muted-foreground select-none">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Popup className="w-40">
        <ContextMenu.Group>
          <ContextMenu.Item>
            <Send /> Forward
            <ContextMenu.Shortcut>⌘F</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item>
            <Reply /> Reply
            <ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item>
            <ReplyAll /> Reply all
            <ContextMenu.Shortcut>⌘A</ContextMenu.Shortcut>
          </ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />

        <ContextMenu.Group>
          <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
          <ContextMenu.CheckboxItem checked>Show grid</ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem>Show rulers</ContextMenu.CheckboxItem>
        </ContextMenu.Group>

        <ContextMenu.Separator />

        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Theme</ContextMenu.GroupLabel>
          <ContextMenu.RadioGroup defaultValue="system">
            <ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Group>

        <ContextMenu.Separator />

        <ContextMenu.Submenu>
          <ContextMenu.SubmenuTrigger>Export as</ContextMenu.SubmenuTrigger>
          <ContextMenu.Popup>
            <ContextMenu.Item>PNG</ContextMenu.Item>
            <ContextMenu.Item>SVG</ContextMenu.Item>
            <ContextMenu.Item>PDF</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Submenu>

        <ContextMenu.Separator />
        <ContextMenu.Item variant="destructive">
          <Trash2 /> Delete
          <ContextMenu.Shortcut>⌘ ⌫</ContextMenu.Shortcut>
        </ContextMenu.Item>
      </ContextMenu.Popup>
    </ContextMenu>
  );
}
