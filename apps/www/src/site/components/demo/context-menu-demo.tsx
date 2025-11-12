import { ContextMenu } from "@ui/components/context-menu";

const code = `import { ContextMenu } from "@ui/components/context-menu";

export default function Example() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>
        <div className="h-40 w-80 border border-dashed rounded-md flex items-center justify-center text-sm bg-background-secondary">
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content className="w-56" align="start">
        <ContextMenu.Label>My Account</ContextMenu.Label>
        <ContextMenu.Group>
          <ContextMenu.Item>
            Profile
            <ContextMenu.Shortcut shortcutKey="⌘+p" />
          </ContextMenu.Item>
          <ContextMenu.Item>
            Billing
            <ContextMenu.Shortcut shortcutKey="⌘+b" />
          </ContextMenu.Item>
          <ContextMenu.Item>
            Settings
            <ContextMenu.Shortcut shortcutKey="⌘+s" />
          </ContextMenu.Item>
          <ContextMenu.Item>
            Keyboard shortcuts
            <ContextMenu.Shortcut shortcutKey="⌘+k" />
          </ContextMenu.Item>
          <ContextMenu.Item>
            Help & Feedback
            <ContextMenu.Shortcut>F1</ContextMenu.Shortcut>
          </ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.Item>Team</ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Invite users</ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent>
                <ContextMenu.Item>Email</ContextMenu.Item>
                <ContextMenu.Item>Message</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item>More...</ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          <ContextMenu.Item>
            New Team
            <ContextMenu.Shortcut shortcutKey="⌘+t" />
          </ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Item>GitHub</ContextMenu.Item>
        <ContextMenu.Item>Support</ContextMenu.Item>
        <ContextMenu.Item disabled>API</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>
          Log out
          <ContextMenu.Shortcut shortcutKey="⇧⌘Q" />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <ContextMenu>
        <ContextMenu.Trigger asChild>
          <div className="h-40 w-80 border border-border border-dashed rounded-md flex items-center justify-center text-sm bg-background-secondary">
            Right-click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content className="w-56" align="start">
          <ContextMenu.Label>My Account</ContextMenu.Label>
          <ContextMenu.Group>
            <ContextMenu.Item>
              Profile
              <ContextMenu.Shortcut shortcutKey="⌘+p" />
            </ContextMenu.Item>
            <ContextMenu.Item>
              Billing
              <ContextMenu.Shortcut shortcutKey="⌘+b" />
            </ContextMenu.Item>
            <ContextMenu.Item>
              Settings
              <ContextMenu.Shortcut shortcutKey="⌘+s" />
            </ContextMenu.Item>
            <ContextMenu.Item>
              Keyboard shortcuts
              <ContextMenu.Shortcut shortcutKey="⌘+k" />
            </ContextMenu.Item>
            <ContextMenu.Item>
              Help & Feedback
              <ContextMenu.Shortcut>F1</ContextMenu.Shortcut>
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Group>
            <ContextMenu.Item>Team</ContextMenu.Item>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Invite users</ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.SubContent>
                  <ContextMenu.Item>Email</ContextMenu.Item>
                  <ContextMenu.Item>Message</ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item>More...</ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
            <ContextMenu.Item>
              New Team
              <ContextMenu.Shortcut shortcutKey="⌘+t" />
            </ContextMenu.Item>
          </ContextMenu.Group>
          <ContextMenu.Separator />
          <ContextMenu.Item>GitHub</ContextMenu.Item>
          <ContextMenu.Item>Support</ContextMenu.Item>
          <ContextMenu.Item disabled>API</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>
            Log out
            <ContextMenu.Shortcut shortcutKey="⇧⌘Q" />
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
};

export const ContextMenuDemo = {
  code,
  component: <Component />,
};
