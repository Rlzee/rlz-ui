"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { Select } from "@rlz/ui/components/ui/select";
import {
  styleGroupsAtom,
  selectedStyleGroupAtom,
} from "../../state/style-group-state";
import { ComponentExamplesPreview } from "./component-examples-preview";
import { EmptyState } from "./preview-shell";

export function GroupsPreview() {
  const groups = useAtomValue(styleGroupsAtom);
  const selectedId = useAtomValue(selectedStyleGroupAtom);
  const group = groups.find(({ id }) => id === selectedId) ?? groups[0];
  const components = [
    ...new Set(group?.members.map(({ component }) => component)),
  ];
  const [chosen, setChosen] = useState("");
  const component = components.includes(chosen) ? chosen : components[0];
  if (!group || !component)
    return (
      <EmptyState>Add component parts to the group to preview them.</EmptyState>
    );
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{group.name}</p>
          <p className="text-xs text-muted-foreground">
            Changes apply to every member. Choose a component to inspect.
          </p>
        </div>
        <Select
          value={component}
          onValueChange={(value) => {
            if (typeof value === "string") setChosen(value);
          }}
        >
          <Select.Trigger
            className="max-w-52"
            aria-label="Group preview component"
          >
            <Select.Value>{component}</Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Popup>
            <Select.List>
              {components.map((slug) => (
                <Select.Item key={slug} value={slug}>
                  <Select.ItemIndicator />
                  <Select.ItemText>{slug}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select>
      </div>
      <ComponentExamplesPreview slug={component} name={component} />
    </div>
  );
}
