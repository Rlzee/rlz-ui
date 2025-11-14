import { Command } from "@ui/components/command";
import {
  Calendar,
  Calculator,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

export const code = `import { Command } from "@ui/components/command";
import {
  Calendar,
  Calculator,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

export default function Example() {
  return (
    <Command className="max-w-lg">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Suggestions">
          <Command.Item>
            <Calendar />
            <span>Calendar</span>
          </Command.Item>
          <Command.Item>
            <Smile />
            <span>Search Emoji</span>
          </Command.Item>
          <Command.Item>
            <Calculator />
            <span>Calculator</span>
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Settings">
          <Command.Item>
            <User />
            <span>Profile</span>
            <Command.Shortcut shortcutKey="⌘P" />
          </Command.Item>
          <Command.Item>
            <CreditCard />
            <span>Billing</span>
            <Command.Shortcut shortcutKey="⌘B" />
          </Command.Item>
          <Command.Item>
            <Settings />
            <span>Settings</span>
            <Command.Shortcut shortcutKey="⌘S" />
          </Command.Item>
        </Command.Group>
      </Command.List>
      <Command.Footer className="flex justify-end items-center h-11">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          Press <Command.Shortcut shortcutKey="Esc" /> to close
        </span>
      </Command.Footer>
    </Command>
  );
}`;

const Component = () => {
  return (
    <div className="flex items-center justify-center">
      <Command className="max-w-lg">
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Command.Item>
              <Calendar />
              <span>Calendar</span>
            </Command.Item>
            <Command.Item>
              <Smile />
              <span>Search Emoji</span>
            </Command.Item>
            <Command.Item>
              <Calculator />
              <span>Calculator</span>
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Settings">
            <Command.Item>
              <User />
              <span>Profile</span>
              <Command.Shortcut shortcutKey="⌘P" />
            </Command.Item>
            <Command.Item>
              <CreditCard />
              <span>Billing</span>
              <Command.Shortcut shortcutKey="⌘B" />
            </Command.Item>
            <Command.Item>
              <Settings />
              <span>Settings</span>
              <Command.Shortcut shortcutKey="⌘S" />
            </Command.Item>
          </Command.Group>
        </Command.List>
        <Command.Footer className="flex justify-end items-center h-11">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Press <Command.Shortcut shortcutKey="Esc" /> to close
          </span>
        </Command.Footer>
      </Command>
    </div>
  );
};

export const CommandDemo = {
  code,
  component: <Component />,
};
