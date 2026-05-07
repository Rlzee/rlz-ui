"use client";

import { Fragment } from "react";
import { Combobox } from "@rlz/ui/components/ui/combobox";

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
    <Combobox items={groups}>
      <Combobox.Field
        aria-label="Search tags..."
        placeholder="Search tags..."
        className="mx-auto w-60"
      />
      <Combobox.Popup>
        <Combobox.Empty>No results found.</Combobox.Empty>
        <Combobox.List>
          {(group: Group) => (
            <Fragment key={group.value}>
              <Combobox.Group items={group.items}>
                <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
                <Combobox.Collection>
                  {(item: Item) => (
                    <Combobox.Item key={item.value} value={item.value}>
                      {item.label}
                    </Combobox.Item>
                  )}
                </Combobox.Collection>
              </Combobox.Group>
              <Combobox.Separator />
            </Fragment>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
