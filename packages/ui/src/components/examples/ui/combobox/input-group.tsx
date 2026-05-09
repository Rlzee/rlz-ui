"use client";

import * as React from "react";
import { Combobox } from "@rlz/ui/components/ui/combobox";
import { InputGroup } from "@rlz/ui/components/ui/input-group";
import { Search } from "lucide-react";

const langs = [
  { id: "js", value: "JavaScript" },
  { id: "ts", value: "TypeScript" },
  { id: "py", value: "Python" },
  { id: "java", value: "Java" },
  { id: "cpp", value: "C++" },
  { id: "cs", value: "C#" },
  { id: "php", value: "PHP" },
  { id: "ruby", value: "Ruby" },
  { id: "go", value: "Go" },
  { id: "rust", value: "Rust" },
  { id: "swift", value: "Swift" },
];

export default function Example() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Combobox items={langs}>
      <InputGroup className="w-60" ref={inputRef}>
        <InputGroup.Addon align="inline-start">
          <Search />
        </InputGroup.Addon>
        <Combobox.Field unstyled placeholder="Select a language" clearable />
      </InputGroup>
      <Combobox.Popup
        positionerProps={{
          anchor: inputRef,
        }}
      >
        <Combobox.Empty>No fruits found.</Combobox.Empty>
        <Combobox.List>
          {(item) => (
            <Combobox.Item key={item.id} value={item.value}>
              <Combobox.ItemIndicator />
              <Combobox.ItemText>{item.value}</Combobox.ItemText>
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox>
  );
}
