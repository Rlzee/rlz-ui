"use client";

import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";
import { Input } from "@rlz/ui/components/ui/input";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Button } from "@rlz/ui/components/ui/button";
import { AtSign } from "lucide-react";

const members = [
  { value: "alice", label: "Alice Martin" },
  { value: "bob", label: "Bob Chen" },
  { value: "carol", label: "Carol Davis" },
  { value: "dan", label: "Dan Kim" },
  { value: "eva", label: "Eva Rossi" },
];

export default function Example() {
  return (
    <div className="mx-auto w-[16rem]">
      <InputGroup>
        <Input
          placeholder="Add a comment..."
          className="mx-auto w-60"
          unstyled
        />
        <InputGroup.Addon align="inline-end">
          <Autocomplete items={members}>
            <Autocomplete.Trigger
              render={<Button size="icon-xs" variant="ghost" />}
            >
              <AtSign className="h-4 w-4" />
            </Autocomplete.Trigger>
            <Autocomplete.Popup
              className="w-56"
              positionerProps={{ align: "end", sideOffset: 8 }}
            >
              <Autocomplete.Input placeholder="Mention someone..." />
              <Autocomplete.Empty>No members found.</Autocomplete.Empty>
              <Autocomplete.List>
                {(member) => (
                  <Autocomplete.Item key={member.value} value={member.value}>
                    {member.label}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete>
        </InputGroup.Addon>
      </InputGroup>
    </div>
  );
}
