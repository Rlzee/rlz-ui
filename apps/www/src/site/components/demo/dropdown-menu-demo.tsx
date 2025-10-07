import { DropdownMenu } from "@ui/components/dropdown-menu";
import { Button } from "@ui/components/button";

const code = `import { DropdownMenu } from "@ui/components/dropdown-menu";
import { Button } from "@ui/components/button";

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="start">
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            Profile
            <DropdownMenu.Shortcut shortcutKey="⌘+p" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Billing
            <DropdownMenu.Shortcut shortcutKey="⌘+b" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Settings
            <DropdownMenu.Shortcut shortcutKey="⌘+s" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Keyboard shortcuts
            <DropdownMenu.Shortcut shortcutKey="⌘+k" />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>Team</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Email</DropdownMenu.Item>
                <DropdownMenu.Item>Message</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>More...</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Item>
            New Team
            <DropdownMenu.Shortcut>⌘+t</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>GitHub</DropdownMenu.Item>
        <DropdownMenu.Item>Support</DropdownMenu.Item>
        <DropdownMenu.Item disabled>API</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          Log out
          <DropdownMenu.Shortcut shortcutKey="⇧⌘Q" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="start">
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            Profile
            <DropdownMenu.Shortcut shortcutKey="⌘+p" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Billing
            <DropdownMenu.Shortcut shortcutKey="⌘+b" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Settings
            <DropdownMenu.Shortcut shortcutKey="⌘+s" />
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Keyboard shortcuts
            <DropdownMenu.Shortcut shortcutKey="⌘+k" />
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>Team</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Email</DropdownMenu.Item>
                <DropdownMenu.Item>Message</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>More...</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Item>
            New Team
            <DropdownMenu.Shortcut>⌘+t</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>GitHub</DropdownMenu.Item>
        <DropdownMenu.Item>Support</DropdownMenu.Item>
        <DropdownMenu.Item disabled>API</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          Log out
          <DropdownMenu.Shortcut shortcutKey="⇧⌘Q" />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
    </div>
  );
};

export const DropdownMenuDemo = {
  code,
  component: <Component />,
};
