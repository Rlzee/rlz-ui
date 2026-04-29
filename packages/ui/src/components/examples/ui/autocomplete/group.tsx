"use client";

import { Fragment } from "react";
import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";

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
      { value: "in-progress", label: "In progress" },
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
    <Autocomplete items={groups}>
      <Autocomplete.Input
        aria-label="Search tags..."
        placeholder="Search tags..."
        className="mx-auto w-60"
      />
      <Autocomplete.Popup>
        <Autocomplete.Empty>No results found.</Autocomplete.Empty>
        <Autocomplete.List>
          {(group: Group) => (
            <Fragment key={group.value}>
              <Autocomplete.Group items={group.items}>
                <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                <Autocomplete.Collection>
                  {(item: Item) => (
                    <Autocomplete.Item key={item.value} value={item.value}>
                      {item.label}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.Collection>
              </Autocomplete.Group>
              <Autocomplete.Separator />
            </Fragment>
          )}
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete>
  );
}
