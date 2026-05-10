"use client";

import { Command } from "@rlz/ui/components/ui/command";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Kbd } from "@rlz/ui/components/ui/kbd";
import { Fragment } from "react";
import {
  Search,
  ArrowUpIcon,
  ArrowDownIcon,
  CornerDownLeftIcon,
} from "lucide-react";

export interface Item {
  value: string;
  label: string;
  shortcut?: string;
}

export interface Group {
  value: string;
  items: Item[];
}

export const suggestions: Item[] = [
  { label: "Linear", shortcut: "⌘L", value: "linear" },
  { label: "Figma", shortcut: "⌘F", value: "figma" },
  { label: "Slack", shortcut: "⌘S", value: "slack" },
  { label: "YouTube", shortcut: "⌘Y", value: "youtube" },
  { label: "Raycast", shortcut: "⌘R", value: "raycast" },
];

export const commands: Item[] = [
  { label: "Clipboard History", shortcut: "⌘⇧C", value: "clipboard-history" },
  { label: "Import Extension", shortcut: "⌘I", value: "import-extension" },
  { label: "Create Snippet", shortcut: "⌘N", value: "create-snippet" },
  { label: "System Preferences", shortcut: "⌘,", value: "system-preferences" },
  { label: "Window Management", shortcut: "⌘⇧W", value: "window-management" },
];

export const groupedItems: Group[] = [
  { items: suggestions, value: "Suggestions" },
  { items: commands, value: "Commands" },
];

export default function Example() {
  return (
    <Command items={groupedItems} className="w-120">
      <InputGroup variant="accent">
        <InputGroup.Addon align="inline-start">
          <Search />
        </InputGroup.Addon>
        <Command.Input unstyled placeholder="Type a command or search..." />
      </InputGroup>
      <Command.Empty>No Results Found.</Command.Empty>
      <Command.List>
        {(group: Group) => (
          <Fragment key={group.value}>
            <Command.Group items={group.items}>
              <Command.GroupLabel>{group.value}</Command.GroupLabel>
              <Command.Collection>
                {(item: Item) => (
                  <Command.Item key={item.value} value={item.value}>
                    <span className="flex-1">{item.label}</span>
                    <Command.Shortcut>{item.shortcut}</Command.Shortcut>
                  </Command.Item>
                )}
              </Command.Collection>
            </Command.Group>
            <Command.Separator />
          </Fragment>
        )}
      </Command.List>
      <Command.Footer>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Kbd.Group>
              <Kbd className="bg-accent border-0">
                <ArrowUpIcon />
              </Kbd>
              <Kbd className="bg-accent border-0">
                <ArrowDownIcon />
              </Kbd>
            </Kbd.Group>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd className="bg-accent border-0">
              <CornerDownLeftIcon />
            </Kbd>
            <span>Open</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Kbd className="bg-accent border-0">Esc</Kbd>
          <span>Close</span>
        </div>
      </Command.Footer>
    </Command>
  );
}
