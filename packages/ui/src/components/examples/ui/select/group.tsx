"use client";

import { Select } from "@rlz/ui/components/ui/select";
import React from "react";

type Item = {
  value: string;
  label: string;
};

type Group = {
  value: string;
  items: Item[];
};

const groups: Group[] = [
  {
    value: "Status",
    items: [
      { value: "open", label: "Open" },
      { value: "blocked", label: "Blocked" },
      { value: "closed", label: "Closed" },
    ],
  },
  {
    value: "Priority",
    items: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
  },
  {
    value: "Team",
    items: [
      { value: "frontend", label: "Frontend" },
      { value: "backend", label: "Backend" },
      { value: "design", label: "Design" },
      { value: "devops", label: "DevOps" },
    ],
  },
];

export default function Example() {
  return (
    <Select>
      <Select.Trigger className="w-full max-w-50">
        <Select.Value placeholder="Select an option" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Popup>
        <Select.List>
          {groups.map((group, i) => (
            <React.Fragment key={group.value}>
              <Select.Group>
                <Select.GroupLabel>{group.value}</Select.GroupLabel>
                {group.items.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Group>
              {i < groups.length - 1 && <Select.Separator />}
            </React.Fragment>
          ))}
        </Select.List>
      </Select.Popup>
    </Select>
  );
}
