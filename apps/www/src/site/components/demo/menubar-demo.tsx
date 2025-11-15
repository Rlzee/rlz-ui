import { Menubar } from "@ui/components/menubar";

const code = `import { Menubar } from "@ui/components/menubar";

export default function Example() {
  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>
            New Tab <Menubar.Shortcut shortcutKey="⌘T" />
          </Menubar.Item>
          <Menubar.Item>
            New Window <Menubar.Shortcut shortcutKey="⌘N" />
          </Menubar.Item>
          <Menubar.Item disabled>New Incognito Window</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Sub>
            <Menubar.SubTrigger>Share</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item>Email link</Menubar.Item>
              <Menubar.Item>Messages</Menubar.Item>
              <Menubar.Item>Notes</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.Sub>
          <Menubar.Separator />
          <Menubar.Item>
            Print... <Menubar.Shortcut shortcutKey="⌘P" />
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>
            Undo <Menubar.Shortcut shortcutKey="⌘Z" />
          </Menubar.Item>
          <Menubar.Item>
            Redo <Menubar.Shortcut shortcutKey="⇧⌘Z" />
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.Sub>
            <Menubar.SubTrigger>Find</Menubar.SubTrigger>
            <Menubar.SubContent>
              <Menubar.Item>Search the web</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>Find...</Menubar.Item>
              <Menubar.Item>Find Next</Menubar.Item>
              <Menubar.Item>Find Previous</Menubar.Item>
            </Menubar.SubContent>
          </Menubar.Sub>
          <Menubar.Separator />
          <Menubar.Item>Cut</Menubar.Item>
          <Menubar.Item>Copy</Menubar.Item>
          <Menubar.Item>Paste</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.CheckboxItem>
            Always Show Bookmarks Bar
          </Menubar.CheckboxItem>
          <Menubar.CheckboxItem checked>
            Always Show Full URLs
          </Menubar.CheckboxItem>
          <Menubar.Separator />
          <Menubar.Item inset>
            Reload <Menubar.Shortcut shortcutKey="⌘R" />
          </Menubar.Item>
          <Menubar.Item disabled inset>
            Force Reload <Menubar.Shortcut shortcutKey="⇧⌘R" />
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item inset>Toggle Fullscreen</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item inset>Hide Sidebar</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Profiles</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.RadioGroup value="benoit">
            <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
            <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
            <Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
          </Menubar.RadioGroup>
          <Menubar.Separator />
          <Menubar.Item inset>Edit...</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item inset>Add Profile...</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>
              New Tab <Menubar.Shortcut shortcutKey="⌘T" />
            </Menubar.Item>
            <Menubar.Item>
              New Window <Menubar.Shortcut shortcutKey="⌘N" />
            </Menubar.Item>
            <Menubar.Item disabled>New Incognito Window</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Sub>
              <Menubar.SubTrigger>Share</Menubar.SubTrigger>
              <Menubar.SubContent>
                <Menubar.Item>Email link</Menubar.Item>
                <Menubar.Item>Messages</Menubar.Item>
                <Menubar.Item>Notes</Menubar.Item>
              </Menubar.SubContent>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item>
              Print... <Menubar.Shortcut shortcutKey="⌘P" />
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>
              Undo <Menubar.Shortcut shortcutKey="⌘Z" />
            </Menubar.Item>
            <Menubar.Item>
              Redo <Menubar.Shortcut shortcutKey="⇧⌘Z" />
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Sub>
              <Menubar.SubTrigger>Find</Menubar.SubTrigger>
              <Menubar.SubContent>
                <Menubar.Item>Search the web</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item>Find...</Menubar.Item>
                <Menubar.Item>Find Next</Menubar.Item>
                <Menubar.Item>Find Previous</Menubar.Item>
              </Menubar.SubContent>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item>Cut</Menubar.Item>
            <Menubar.Item>Copy</Menubar.Item>
            <Menubar.Item>Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem>
              Always Show Bookmarks Bar
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem checked>
              Always Show Full URLs
            </Menubar.CheckboxItem>
            <Menubar.Separator />
            <Menubar.Item inset>
              Reload <Menubar.Shortcut shortcutKey="⌘R" />
            </Menubar.Item>
            <Menubar.Item disabled inset>
              Force Reload <Menubar.Shortcut shortcutKey="⇧⌘R" />
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item inset>Toggle Fullscreen</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item inset>Hide Sidebar</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Profiles</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.RadioGroup value="benoit">
              <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
              <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
              <Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
            </Menubar.RadioGroup>
            <Menubar.Separator />
            <Menubar.Item inset>Edit...</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item inset>Add Profile...</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </div>
  );
};

export const MenubarDemo = {
  code,
  component: <Component />,
};
