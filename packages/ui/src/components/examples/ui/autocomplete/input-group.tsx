"use client";

import * as React from "react";
import { Autocomplete } from "@rlz/ui/components/ui/autocomplete";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Search } from "lucide-react";

const fruits = [
  "Apple",
  "Banana",
  "Orange",
  "Pineapple",
  "Grape",
  "Mango",
  "Strawberry",
  "Blueberry",
  "Raspberry",
  "Blackberry",
];

export default function Example() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Autocomplete items={fruits}>
      <InputGroup className="w-60" ref={inputRef}>
        <InputGroup.Addon align="inline-start">
          <Search />
        </InputGroup.Addon>
        <Autocomplete.Input
          unstyled
          aria-label="Search fruit"
          placeholder="Search fruit"
        />
      </InputGroup>
      <Autocomplete.Popup
        positionerProps={{
          anchor: inputRef,
        }}
      >
        <Autocomplete.Empty>No fruits found.</Autocomplete.Empty>
        <Autocomplete.List>
          {(item: string) => (
            <Autocomplete.Item key={item} value={item}>
              {item}
            </Autocomplete.Item>
          )}
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete>
  );
}
